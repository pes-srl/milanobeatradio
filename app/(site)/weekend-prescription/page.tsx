import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'

export const metadata: Metadata = {
  title: 'Weekend Prescription \u00b7 Milano Beat Radio',
  description:
    'La ricetta sonora di MBR per il tuo weekend: tre tracce selezionate per venerd\u00ec sera, sabato notte e domenica reset.',
}

export const revalidate = 3600

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   DATO DELLA SETTIMANA
   \u2190 L\u2019IA (o tu) modifica solo questo blocco ogni settimana.
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
const prescription = {
  weekendDate: '3\u20135 Ottobre 2026',
  weekendMood: 'Autunno Hypnotico',
  weekendSub:
    "Milano si tinge di nebbia e le frequenze si fanno pi\u00f9 profonde. Questo \u00e8 il soundtrack del primo weekend d\u2019autunno.",

  tracks: {
    friday: {
      index: '01',
      day: 'Venerd\u00ec',
      moment: 'The Warm-Up',
      description:
        "Il brano ideale per entrare in modalit\u00e0 serata: groove sottile, tensione crescente, adatto all\u2019aperitivo che diventa qualcosa di pi\u00f9.",
      artist: 'Peggy Gou',
      title: '(It Goes Like) Nanana',
      year: '2023',
      genre: 'Afro House / Nu-Disco',
      bpm: '122 BPM',
      vibe: 'Sunset Groove',
      spotifyUrl: 'https://open.spotify.com/track/4EqCCEEFOtbCWGRhWJUv0x',
      youtubeUrl: 'https://www.youtube.com/watch?v=4fGjSMRCJzA',
    },
    saturday: {
      index: '02',
      day: 'Sabato',
      moment: 'Peak Time',
      description:
        'A mezzanotte esatta. La traccia che spacca il dancefloor in due: hypnotica, oscura, irresistibile. Nessuna scelta migliore.',
      artist: 'Chris Liebing',
      title: 'Loveforce (Original Mix)',
      year: '2024',
      genre: 'Techno / Industrial',
      bpm: '138 BPM',
      vibe: 'Dark Dancefloor',
      spotifyUrl: 'https://open.spotify.com/track/5Y75QYIM0EsT3sNkVSwG0R',
      youtubeUrl: 'https://www.youtube.com/watch?v=EaW0HS5dPwk',
    },
    sunday: {
      index: '03',
      day: 'Domenica',
      moment: 'The Reset',
      description:
        "La domenica appartiene al silenzio, al caff\u00e8 e al sole filtrato. Un brano che abbraccia e fa passare tutto.",
      artist: 'Nicolas Jaar',
      title: 'Space Is Only Noise If You Can See',
      year: '2011',
      genre: 'Downtempo / Ambient',
      bpm: '72 BPM',
      vibe: 'Sunday Morning',
      spotifyUrl: 'https://open.spotify.com/track/1j3dJhBtizI9p2VBimXQMD',
      youtubeUrl: 'https://www.youtube.com/watch?v=pjFTxz4aSWA',
    },
  },
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   SVG icons \u2014 zero emoji, peso zero, eleganza massima
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
function IconSpotify() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Card elegante: niente emoji, numerazione editoriale, linea brand
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
type TrackCard = (typeof prescription.tracks)[keyof typeof prescription.tracks]

function PrescriptionCard({ track }: { track: TrackCard }) {
  return (
    <article className="group relative flex flex-col border-t border-white/10 pt-8 pb-10 transition-colors duration-300 hover:border-brand/40">

      {/* Thin brand accent line that grows on hover — pure CSS, no JS */}
      <div
        className="absolute top-0 left-0 h-px w-0 bg-brand transition-[width] duration-500 ease-out group-hover:w-full"
        aria-hidden="true"
      />

      {/* Index + day header */}
      <div className="mb-7 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] font-semibold tracking-[0.25em] text-brand/70 select-none">
            {track.index}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/35">
            {track.day}
          </span>
        </div>
        {/* BPM as typographic detail, top-right */}
        <span className="font-mono text-[11px] tracking-widest text-white/25">
          {track.bpm}
        </span>
      </div>

      {/* Moment title */}
      <h3 className="mb-4 text-xl sm:text-2xl font-bold uppercase tracking-[0.08em] text-white leading-tight">
        {track.moment}
      </h3>

      {/* Editorial description */}
      <p className="mb-8 text-sm text-white/55 leading-relaxed flex-1">
        {track.description}
      </p>

      {/* Track block: divider line + artist / title */}
      <div className="mb-6 border-t border-white/[0.07] pt-6">
        <p className="mb-1 text-base sm:text-lg font-semibold text-white leading-snug">
          {track.artist}
        </p>
        <p className="mb-5 text-sm font-light italic text-white/50">
          &ldquo;{track.title}&rdquo;
          <span className="ml-2 not-italic font-semibold text-white/25 text-xs">{track.year}</span>
        </p>

        {/* Minimal metadata tags — flat, no filled backgrounds */}
        <div className="flex flex-wrap gap-2">
          <span className="border border-brand/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand/70">
            {track.genre}
          </span>
          <span className="border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            {track.vibe}
          </span>
        </div>
      </div>

      {/* Listen links — text links, no pill buttons */}
      <div className="flex flex-wrap items-center gap-5">
        {track.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 transition-colors duration-200 hover:text-[#1DB954]"
          >
            <IconSpotify />
            Spotify
          </a>
        )}
        {track.youtubeUrl && (
          <a
            href={track.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 transition-colors duration-200 hover:text-white/80"
          >
            <IconYoutube />
            YouTube
          </a>
        )}
      </div>
    </article>
  )
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Pagina
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
export default function WeekendPrescriptionPage() {
  const { tracks, weekendDate, weekendMood, weekendSub } = prescription

  return (
    <>
      <PageHero
        overtitle="Milano Beat Radio"
        title="Weekend Prescription"
        subtitle="La ricetta sonora per il tuo weekend"
        size="lg"
      />

      <section className="bg-black px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">

          {/* Weekend header — editorial, typographic, zero effects */}
          <header className="mb-16 sm:mb-20">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-white/25">
              For the next weekend &nbsp;&middot;&nbsp; {weekendDate}
            </p>
            <h2 className="mb-5 text-3xl sm:text-4xl font-black uppercase tracking-[0.06em] text-white">
              {weekendMood}
            </h2>
            {/* Single thin brand rule */}
            <div className="mb-6 h-px w-12 bg-brand" />
            <p className="max-w-xl text-sm sm:text-base text-white/45 leading-relaxed font-light">
              {weekendSub}
            </p>
          </header>

          {/* 3 cards — clean grid with top-border separators, no boxes/shadows */}
          <div className="grid gap-0 sm:grid-cols-3 sm:gap-x-10 lg:gap-x-16">
            <PrescriptionCard track={tracks.friday} />
            <PrescriptionCard track={tracks.saturday} />
            <PrescriptionCard track={tracks.sunday} />
          </div>

          {/* Editorial footer stamp */}
          <footer className="mt-20 border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
              Selezione editoriale &mdash; Milano Beat Radio
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
              Aggiornata ogni settimana
            </p>
          </footer>

        </div>
      </section>
    </>
  )
}
