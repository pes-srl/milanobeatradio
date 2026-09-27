import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'

export const metadata: Metadata = {
  title: 'Weekend Prescription \u00b7 Milano Beat Radio',
  description:
    'La ricetta sonora di MBR per il tuo weekend: tre tracce selezionate per venerd\u00ec sera, sabato notte e domenica reset.',
}

export const revalidate = 3600

/* ──────────────────────────────────────────────────────────────────
   DATO DELLA SETTIMANA — l'IA (o tu) modifica solo questo blocco
   ────────────────────────────────────────────────────────────────── */
const prescription = {
  weekendDate: '3\u20135 Ottobre 2026',
  weekendMood: 'Autunno Hypnotico',
  weekendSub:
    "Milano si tinge di nebbia e le frequenze si fanno pi\u00f9 profonde. Questo \u00e8 il soundtrack del primo weekend d\u2019autunno.",

  tracks: [
    {
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
      spotifyUrl: 'https://open.spotify.com/track/4EqCCEEFOtbCWGRhWJUv0x',
      youtubeUrl: 'https://www.youtube.com/watch?v=4fGjSMRCJzA',
    },
    {
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
      spotifyUrl: 'https://open.spotify.com/track/5Y75QYIM0EsT3sNkVSwG0R',
      youtubeUrl: 'https://www.youtube.com/watch?v=EaW0HS5dPwk',
    },
    {
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
      spotifyUrl: 'https://open.spotify.com/track/1j3dJhBtizI9p2VBimXQMD',
      youtubeUrl: 'https://www.youtube.com/watch?v=pjFTxz4aSWA',
    },
  ],
}

/* SVG icons */
function IconSpotify() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────
   Card — stesso linguaggio visivo del resto del sito
   ────────────────────────────────────────────────────────────────── */
type Track = (typeof prescription.tracks)[number]

function TrackCard({ track }: { track: Track }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/10 transition-all duration-300 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform-gpu">

      {/* Header colorband: linea brand animata */}
      <div className="h-px w-0 bg-brand transition-[width] duration-500 ease-out group-hover:w-full" aria-hidden="true" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* Giorno + BPM */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
            {track.day}
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-widest text-white/40 border border-white/10 px-2 py-0.5">
            {track.bpm}
          </span>
        </div>

        {/* Titolo momento */}
        <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-1">
          {track.moment}
        </h3>

        {/* Genere */}
        <span className="tag mb-4">{track.genre}</span>

        {/* Descrizione */}
        <p className="text-sm text-white/55 leading-relaxed mb-6 flex-1">
          {track.description}
        </p>

        {/* Traccia */}
        <div className="border-t border-white/[0.07] pt-4 mb-5">
          <p className="text-base font-semibold text-white">{track.artist}</p>
          <p className="text-sm italic text-white/45 mt-0.5">
            &ldquo;{track.title}&rdquo;
            <span className="ml-2 not-italic text-xs text-white/25 font-semibold">{track.year}</span>
          </p>
        </div>

        {/* Streaming links */}
        <div className="flex gap-2">
          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#1DB954]/35 bg-[#1DB954]/8 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1DB954] transition-all duration-200 hover:bg-[#1DB954]/15 hover:border-[#1DB954]/60 rounded-lg"
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
              className="inline-flex items-center gap-1.5 border border-[#FF0000]/35 bg-[#FF0000]/8 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#FF4444] transition-all duration-200 hover:bg-[#FF0000]/15 hover:border-[#FF0000]/60 rounded-lg"
            >
              <IconYoutube />
              YouTube
            </a>
          )}
        </div>

      </div>
    </article>
  )
}

/* ──────────────────────────────────────────────────────────────────
   Pagina
   ────────────────────────────────────────────────────────────────── */
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

      <section className="px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1440px]">

          {/* Weekend header */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/30">
              For the next weekend &nbsp;&middot;&nbsp; {weekendDate}
            </p>
            <h2 className="title-xl mb-4">{weekendMood}</h2>
            <p className="mx-auto max-w-lg text-base text-white/45 leading-relaxed font-light">
              {weekendSub}
            </p>
          </div>

          {/* 3 card — stessa griglia dei City Events */}
          <div className="grid gap-6 sm:grid-cols-3">
            {tracks.map((track) => (
              <TrackCard key={track.index} track={track} />
            ))}
          </div>

          {/* Footer */}
          <p className="mt-14 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
            Selezione editoriale aggiornata ogni settimana &mdash; Milano Beat Radio
          </p>

        </div>
      </section>
    </>
  )
}
