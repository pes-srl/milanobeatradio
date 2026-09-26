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
import { getEvent } from '@/src/lib/queries'
import { siteUrl } from '@/src/lib/env'

export const revalidate = 300

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
  const event = await getEvent(slug, isDraft)
  if (!event) notFound()

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

        {/* Event Content Description (if any) */}
        {event.content && (
          <div className="mt-16 border-t border-white/10 pt-12">
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-wider text-white">Dettagli Evento</h2>
            <article className="prose prose-invert max-w-none">
              <RichText data={event.content} />
            </article>
          </div>
        )}

        {/* Editorial Disclaimer & Brand Protection */}
        <div className="mt-16 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 text-xs text-white/50 space-y-1.5">
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
      </main>
    </div>
  )
}
