import { getPayload } from 'payload'
import config from '../../payload.config'

const TAG_NAMES = [
  'Beauty',
  'Bellezza',
  'Benessere',
  'Cultura',
  'Esperienza',
  'Evento',
  'Glow Up',
  'Hair',
  'Iniziative',
  'Innovazione',
  'Intrattenimento',
  "L'Oréal",
  'Make-Up',
  'Milano',
  'Pop-Up',
  'Popup',
  'Scoperta',
  'Skin Test',
  'Skincare',
  'Solidarietà',
  'Sostenibilità',
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const payload = await getPayload({ config })

  // Find matching posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      or: [
        { title: { like: 'Beauty' } },
        { title: { like: 'beauty' } },
        { slug: { like: 'beauty' } },
      ],
    },
    limit: 10,
    depth: 1,
  })

  console.log(`Found ${posts.docs.length} matching posts:`)
  for (const p of posts.docs) {
    console.log(`- ID: ${p.id}, Title: "${p.title}", Slug: "${p.slug}"`)
  }

  if (posts.docs.length === 0) {
    console.error('No matching post found for Beauty Week!')
    process.exit(1)
  }

  // Retrieve or create tag IDs
  const tagIds: number[] = []
  for (const name of TAG_NAMES) {
    const slug = slugify(name)
    const existing = await payload.find({
      collection: 'tags',
      where: {
        or: [
          { slug: { equals: slug } },
          { name: { equals: name } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      tagIds.push(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'tags',
        data: { name, slug },
      })
      tagIds.push(created.id)
    }
  }

  // Update all matching posts
  for (const post of posts.docs) {
    console.log(`Updating post ID ${post.id} ("${post.title}") with ${tagIds.length} tags...`)
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: {
        tags: tagIds,
        _status: 'published',
      },
    })
  }

  console.log('Update complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
