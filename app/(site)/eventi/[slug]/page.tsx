import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/src/components/site/RichText'
import { StatsBar } from '@/src/components/site/StatsBar'
import { ShareButtons } from '@/src/components/site/ShareButtons'
import { IconCalendar, IconCalendarAdd, IconClock, IconExternal, IconPin } from '@/src/components/icons'
import { fmtDate, fmtLong, fmtTime, googleCalendarUrl } from '@/src/lib/format'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { getEvent, getEvents, getPublishedSlugs } from '@/src/lib/queries'
import { siteUrl } from '@/src/lib/env'

// Pre-rendered at build time and served from the CDN. Long revalidate as a safety net: the
// real refresh is on-demand, triggered by the collection's afterChange/afterDelete hooks.
export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('events').catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}

  const img = imageUrl(event.cover, 'hero')
  const description = [
    event.artists ? `Line-up: ${event.artists}` : null,
    [event.venueName, event.city].filter(Boolean).join(', ') || null,
  ].filter(Boolean).join(' · ') || 'Evento su Milano Beat Radio'

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: 'article',
      url: `/eventi/${slug}`,
      images: img ? [{ url: img, width: 1200, height: 630, alt: event.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: img ? [img] : undefined,
    },
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const [event, upcomingRes] = await Promise.all([
    getEvent(slug, isDraft),
    getEvents({ upcoming: true, limit: 4, minCount: 4 }).catch(() => null),
  ])
  if (!event) notFound()

  const otherEvents = (upcomingRes?.docs ?? []).filter((e) => e.id !== event.id).slice(0, 3)

  const eventType = typeof event.eventType === 'object' ? event.eventType : null
  const address = [event.venueName, event.address, event.city].filter(Boolean).join(' — ')
  const img = imageUrl(event.cover, 'hero')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      ...(event.venueName ? { name: event.venueName } : {}),
      address: {
        '@type': 'PostalAddress',
        ...(event.address ? { streetAddress: event.address } : {}),
        ...(event.city ? { addressLocality: event.city } : {}),
        addressCountry: 'IT',
      },
    },
    ...(img ? { image: [img] } : {}),
    url: `${siteUrl()}/eventi/${slug}`,
    organizer: {
      '@type': 'Organization',
      name: 'Milano Beat Radio',
      url: siteUrl(),
    },
    ...(event.artists ? { performer: event.artists.split(',').map((a: string) => ({ '@type': 'PerformingGroup', name: a.trim() })) } : {}),
    ...(event.externalUrl ? { offers: { '@type': 'Offer', url: event.externalUrl, availability: 'https://schema.org/InStock' } } : {}),
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {isDraft && <DraftBanner path={`/eventi/${slug}`} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background glow */}
      {img && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden opacity-25">
          <Image
            src={img}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/eventi"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:text-brand"
          >
            ← Tutti gli eventi
          </Link>
        </div>

        {/* Main Event Showcase Grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Full Clean Poster */}
          <div className="mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="relative aspect-auto overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_15px_50px_rgba(0,0,0,0.9)]">
              {img ? (
                <Image
                  src={img}
                  alt={imageAlt(event.cover, event.title)}
                  width={900}
                  height={1200}
                  priority
                  sizes="(max-width: 540px) 100vw, (max-width: 1024px) 540px, 576px"
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="aspect-[4/5] w-full bg-gradient-to-br from-brand-dark to-black" />
              )}
            </div>
          </div>

          {/* Right Column: Dedicated Info & Details */}
          <div className="flex flex-col space-y-6">
            {/* Event Category / Kicker */}
            {eventType?.name && (
              <div>
                <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                  {eventType.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {event.title}
            </h1>

            {/* Publication Date */}
            {(event.publishedAt || event.createdAt) && (
              <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <IconCalendar size={16} className="text-brand" />
                <span>Pubblicato il {fmtDate(event.publishedAt ?? event.createdAt)}</span>
              </div>
            )}

            {/* Date & Time Box */}
            <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-3 text-base sm:text-lg font-semibold text-white">
                <IconCalendar size={20} className="shrink-0 text-brand" />
                <span>{fmtLong(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <IconClock size={18} className="shrink-0 text-brand" />
                <span>Inizio: {fmtTime(event.startDate)}{event.endDate ? ` · Fine: ${fmtTime(event.endDate)}` : ''}</span>
              </div>
            </div>

            {/* Venue & Location */}
            {address && (
              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm sm:text-base">
                <IconPin size={20} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  {event.venueName && <p className="font-bold text-white">{event.venueName}</p>}
                  {(event.address || event.city) && (
                    <p className="text-white/70">
                      {[event.address, event.city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Artists / Line-up */}
            {event.artists && (
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">Line-up & Artisti</p>
                <p className="mt-1 text-lg font-bold text-brand">{event.artists}</p>
              </div>
            )}

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={googleCalendarUrl({
                  title: event.title,
                  startDate: event.startDate,
                  endDate: event.endDate,
                  address: event.address,
                  venueName: event.venueName,
                })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:scale-[1.02] hover:bg-emerald-500"
              >
                <IconCalendarAdd size={18} /> Aggiungi al calendario
              </a>

              {event.externalUrl && (
                <a
                  href={event.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand bg-brand/20 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:scale-[1.02] hover:bg-brand"
                >
                  <IconExternal size={18} /> Biglietti / Info Ufficiali
                </a>
              )}
            </div>

            {/* Share Buttons */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">Condividi</p>
              <ShareButtons title={event.title} />
            </div>

            {/* Stats & Social Engagement */}
            <div className="border-t border-white/10 pt-5">
              <StatsBar
                collection="events"
                id={event.id}
                title={event.title}
                views={event.stats?.views}
                likes={event.stats?.likes}
                shares={event.stats?.shares}
              />
            </div>
          </div>
        </div>

        {/* Event Experience Body (Specific City Events Layout) */}
        {event.content && (
          <div className="mt-16 border-t border-white/15 pt-12 sm:pt-16 space-y-12">
            
            {/* 1. Event Experience & Mood Bar (Key event metadata pills) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 transition hover:border-brand/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Sound &amp; Mood</p>
                <p className="mt-1 text-sm font-bold text-white line-clamp-1">
                  {eventType?.name || 'Clubbing & Live'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 transition hover:border-brand/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Location</p>
                <p className="mt-1 text-sm font-bold text-white line-clamp-1">
                  {event.venueName || 'Milano'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 transition hover:border-brand/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Orari Serata</p>
                <p className="mt-1 text-sm font-bold text-white line-clamp-1">
                  Inizio: {fmtTime(event.startDate)}{event.endDate ? ` · Fine: ${fmtTime(event.endDate)}` : ''}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 transition hover:border-brand/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Ingresso</p>
                <p className="mt-1 text-sm font-bold text-white line-clamp-1">
                  {event.externalUrl ? 'Prevendita / Ticket' : 'Ingresso all’evento'}
                </p>
              </div>
            </div>

            {/* 2. Main Content & Venue Hub Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Event Storytelling & Line-up focus (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-8 min-w-0">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    L&apos;Esperienza del Party
                  </h3>
                </div>

                <article>
                  <RichText data={event.content} />
                </article>

                {/* Banner Cross-Link to City News */}
                <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand">Dal Magazine di MBR</p>
                    <h4 className="text-sm font-bold text-white mt-0.5">Vuoi scoprire interviste, artisti e tendenze?</h4>
                  </div>
                  <Link
                    href="/flash-news"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-[#e0246f] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95 shrink-0"
                  >
                    ▶ Esplora City News
                  </Link>
                </div>

                {/* Editorial Disclaimer & Brand Protection */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 text-xs text-white/50 space-y-1.5">
                  <p className="font-semibold text-white/70">
                    Segnalazione editoriale e promozione territoriale gratuita:
                  </p>
                  <p className="leading-relaxed">
                    La segnalazione di questo evento è effettuata a titolo interamente gratuito da Milano Beat Radio per promuovere e divulgare le iniziative culturali, musicali e di nightlife sul territorio di Milano, provincia e Monza Brianza (attività non periodica ex L. 62/2001, svolta nell&apos;esercizio del diritto di cronaca ex Art. 21 Cost.). Marchi, denominazioni di locali, festival e format appartengono ai legittimi titolari e sono utilizzati a solo scopo descrittivo. Per richieste di aggiornamento, rettifica o rimozione:{' '}
                    <a href="mailto:info@milanobeatradio.it" className="text-brand hover:underline font-medium">
                      info@milanobeatradio.it
                    </a>.
                  </p>
                </div>
              </div>

              {/* Right Column: Venue Card & Event Details (lg:col-span-5) */}
              <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                
                {/* Card Location & How to Get There */}
                <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-2">
                    <IconPin size={16} /> Location &amp; Come Arrivare
                  </h4>

                  <div className="space-y-2">
                    {event.venueName && (
                      <p className="text-base font-bold text-white">{event.venueName}</p>
                    )}
                    {(event.address || event.city) && (
                      <p className="text-xs text-white/70">
                        {[event.address, event.city].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([event.venueName, event.address, event.city].filter(Boolean).join(' '))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                    >
                      Apri su Google Maps →
                    </a>
                  </div>

                  {event.externalUrl && (
                    <a
                      href={event.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-[#e0246f] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95"
                    >
                      <IconExternal size={16} /> Biglietti Ufficiali
                    </a>
                  )}
                </div>

                {/* Card MBR Events */}
                <div className="rounded-2xl border border-brand/40 bg-gradient-to-br from-[#1c0636] via-[#120424] to-[#0a0a0a] p-5 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-brand">
                    <span className="text-lg">✨</span>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">MBR Events</p>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed">
                    Molto più di un DJ set. Musica, atmosfera e format esclusivi curati da Milano Beat Radio per eventi e party indimenticabili.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/mbr-events"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-[#e0246f] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95"
                    >
                      ▶ Esplora MBR Events
                    </Link>
                  </div>
                </div>

              </aside>

            </div>

            {/* 3. Prossimi Eventi a tutta larghezza in fondo */}
            {otherEvents.length > 0 && (
              <div className="pt-8 border-t border-white/15">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Altri appuntamenti City Events
                  </h4>
                  <Link href="/eventi" className="text-xs font-bold text-brand hover:underline">
                    Vedi tutti gli eventi →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherEvents.map((evt) => {
                    const evtImg = imageUrl(evt.cover, 'thumb')
                    return (
                      <Link
                        key={evt.id}
                        href={`/eventi/${evt.slug}`}
                        className="group flex gap-3.5 p-3.5 rounded-2xl border border-white/10 bg-[#121212] transition hover:border-brand/40 hover:bg-[#161616]"
                      >
                        {evtImg && (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                            <Image
                              src={evtImg}
                              alt={evt.title}
                              fill
                              sizes="64px"
                              className="object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <p className="text-[11px] font-bold text-brand">
                            {fmtDate(evt.startDate)}
                          </p>
                          <p className="text-xs font-bold text-white group-hover:text-brand line-clamp-2 transition mt-0.5">
                            {evt.title}
                          </p>
                          {evt.venueName && (
                            <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                              @{evt.venueName}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
