/**
 * seed-tags.ts — Estrae parole chiave dagli ultimi 2 articoli Flash News
 * e le inserisce come tag nel database via Payload local API.
 *
 * Esecuzione: pnpm tsx --env-file=.env src/scripts/seed-tags.ts
 */

import { getPayload } from 'payload'
import config from '../../payload.config'

// ─── Stop words italiane comuni ────────────────────────────────────────────
const STOP_WORDS = new Set([
  'il','lo','la','i','gli','le','un','una','uno','dei','delle','degli',
  'di','a','da','in','con','su','per','tra','fra','e','o','ma','se',
  'che','chi','cui','non','più','già','anche','come','quando','dove',
  'è','ha','ho','hanno','era','sono','sarà','è','si','ci','ne','al',
  'del','dal','sul','nel','col','tra','suo','sua','suoi','sue','loro',
  'questo','questa','questi','queste','quello','quella','quelli','quelle',
  'molto','dopo','prima','poi','ancora','solo','tutto','tutti','tutte',
  'ogni','durante','fino','oltre','attraverso','mentre','però','così',
  'mi','ti','vi','li','le','gli','lo','la','ce','se','sa','sta','sia',
  'mio','mia','tuo','tua','nostro','vostro','the','and','of','in','to',
  'a','an','is','are','was','were','be','been','being','have','has',
  'do','does','did','will','would','could','should','may','might','must',
  'che', 'per', 'con', 'una', 'uno', 'della', 'dello', 'delle', 'degli',
  'nella', 'nello', 'nelle', 'negli', 'sulla', 'sullo', 'sulle', 'sugli',
  'alla', 'allo', 'alle', 'agli', 'dalla', 'dallo', 'dalle', 'dagli',
  'all', 'nell', 'sull', 'dall',
])

/** Estrae testo leggibile dai nodi Lexical */
function extractTextFromLexical(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const obj = data as Record<string, unknown>

  if (typeof obj.text === 'string') return obj.text

  let text = ''
  if (Array.isArray(obj.children)) {
    for (const child of obj.children) {
      text += ' ' + extractTextFromLexical(child)
    }
  }
  if (Array.isArray(obj.root)) {
    for (const child of obj.root) {
      text += ' ' + extractTextFromLexical(child)
    }
  }
  if (obj.root && typeof obj.root === 'object') {
    text += ' ' + extractTextFromLexical(obj.root)
  }
  return text
}

/** Slugify: minuscolo, rimuove accenti, sostituisce spazi con trattini */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** Estrae le N parole chiave più rilevanti da un testo */
function extractKeywords(text: string, n = 5): string[] {
  const words = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // rimuove accenti
    .replace(/[^a-zàèéìòù\s]/g, ' ')    // rimuove punteggiatura
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w))

  // Conta frequenza
  const freq = new Map<string, number>()
  for (const w of words) {
    freq.set(w, (freq.get(w) ?? 0) + 1)
  }

  // Ordina per frequenza, prende le top N
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w)
}

async function main() {
  console.log('🔧 Avvio seed tag per ultimi 2 articoli Flash News…\n')

  const payload = await getPayload({ config })

  // Prende gli ultimi 2 articoli pubblicati
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 2,
    depth: 2,
  })

  if (posts.length === 0) {
    console.log('❌ Nessun articolo trovato.')
    process.exit(0)
  }

  for (const post of posts) {
    console.log(`\n📄 Articolo: "${post.title}"`)

    // Controlla se ha già tag
    const existingTags = (post.tags ?? []).filter((t): t is import('../payload-types').Tag => typeof t === 'object' && t !== null)
    if (existingTags.length > 0) {
      console.log(`  ⚠️  Ha già ${existingTags.length} tag: ${existingTags.map((t) => t.name).join(', ')} — salto`)
      continue
    }

    // Estrae testo da excerpt + content
    const rawText = [
      post.title ?? '',
      post.excerpt ?? '',
      extractTextFromLexical(post.content),
    ].join(' ')

    const keywords = extractKeywords(rawText, 5)
    console.log(`  🔍 Parole chiave estratte: ${keywords.join(', ')}`)

    const tagIds: number[] = []

    for (const keyword of keywords) {
      const name = keyword.charAt(0).toUpperCase() + keyword.slice(1)
      const slug = slugify(keyword)

      // Cerca tag esistente
      const existing = await payload.find({
        collection: 'tags',
        where: { slug: { equals: slug } },
        limit: 1,
      })

      let tagId: number

      if (existing.docs.length > 0) {
        tagId = existing.docs[0]!.id
        console.log(`    ✅ Tag esistente: "${name}" (id: ${tagId})`)
      } else {
        // Crea nuovo tag
        const created = await payload.create({
          collection: 'tags',
          data: { name, slug },
        })
        tagId = created.id
        console.log(`    🆕 Tag creato: "${name}" (id: ${tagId})`)
      }

      tagIds.push(tagId)
    }

    // Associa tag all'articolo
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { tags: tagIds },
    })

    console.log(`  💾 Tag associati all'articolo "${post.title}"`)
  }

  console.log('\n✅ Seed completato!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Errore:', err)
  process.exit(1)
})
