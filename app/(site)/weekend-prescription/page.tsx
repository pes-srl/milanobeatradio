import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'

export const metadata: Metadata = {
  title: 'Weekend Prescription · Milano Beat Radio',
  description:
    'La ricetta sonora di MBR per il tuo weekend: tre tracce selezionate per venerdì sera, sabato notte e domenica reset.',
}

export const revalidate = 3600 // ricarica al massimo ogni ora

/* ─────────────────────────────────────────────────────────────────
   DATO DELLA SETTIMANA
   ← Qui l'IA (o tu) cambia solo questo oggetto ogni settimana.
   ───────────────────────────────────────────────────────────────── */
const prescription = {
  /** Data di riferimento: il venerdì del weekend in questione */
  weekendDate: '3\u20135 Ottobre 2026',
  /** Titolo editoriale del weekend */
  weekendMood: 'Autunno Hypnotico',
  /** Sottotitolo del mood */
  weekendSub:
    "Milano si tinge di nebbia e le frequenze si fanno pi\u00f9 profonde. Questo \u00e8 il soundtrack del primo weekend d\u2019autunno.",

  tracks: {
    friday: {
      day: 'Venerd\u00ec',
      moment: 'The Warm-Up',
      emoji: '\ud83c\udf19',
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
      day: 'Sabato',
      moment: 'Peak Time',
      emoji: '\ud83d\udd0a',
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
      day: 'Domenica',
      moment: 'The Reset',
      emoji: '\u2615',
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

/* ─────────────────────────────────────────────────────────────────
   Card per ogni momento del weekend
   ───────────────────────────────────────────────────────────────── */
type TrackCard = (typeof prescription.tracks)[keyof typeof prescription.tracks]

function PrescriptionCard({
  track,
  gradient,
}: {
  track: TrackCard
  gradient: string
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]`}
    >
      {/* Subtle background glow */}
      <div
        className={`pointer-events-none absolute inset-0 ${gradient} opacity-0 transition-opacity duration-500 hover:opacity-100 rounded-3xl`}
      />

      {/* Day + moment header */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand mb-1">
            {track.day}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {track.moment}
          </h3>
        </div>
        <span className="text-5xl select-none" aria-hidden="true">
          {track.emoji}
        </span>
      </div>

      {/* Editorial description */}
      <p className="relative z-10 text-sm sm:text-base text-white/70 leading-relaxed mb-8 flex-1">
        {track.description}
      </p>

      {/* Track info block */}
      <div className="relative z-10 rounded-2xl border border-white/10 bg-black/40 p-5 mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
          La traccia
        </p>
        <p className="text-lg sm:text-xl font-black text-white leading-tight">
          {track.artist}
        </p>
        <p className="text-base font-medium text-white/80 italic mb-4">
          &ldquo;{track.title}&rdquo; &nbsp;
          <span className="text-xs not-italic font-semibold text-white/40">
            {track.year}
          </span>
        </p>

        {/* Tags / pill metadata */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {track.genre}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            {track.bpm}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            {track.vibe}
          </span>
        </div>
      </div>

      {/* CTA links */}
      <div className="relative z-10 flex flex-wrap gap-3">
        {track.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#1DB954]/40 bg-[#1DB954]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1DB954] transition-all duration-300 hover:bg-[#1DB954]/20 hover:border-[#1DB954] hover:shadow-[0_0_20px_rgba(29,185,84,0.3)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Ascolta su Spotify
          </a>
        )}
        {track.youtubeUrl && (
          <a
            href={track.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#FF0000]/40 bg-[#FF0000]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FF4444] transition-all duration-300 hover:bg-[#FF0000]/20 hover:border-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.25)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Guarda su YouTube
          </a>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Pagina principale
   ───────────────────────────────────────────────────────────────── */
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

      <section className="bg-black px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Weekend identity badge */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              For the next weekend · {weekendDate}
            </p>
            <h2 className="mb-4 text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {weekendMood}
            </h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              {weekendSub}
            </p>
            <div className="mt-6 inline-block h-px w-16 bg-brand/60" />
          </div>

          {/* 3 prescription cards */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            <PrescriptionCard
              track={tracks.friday}
              gradient="bg-[radial-gradient(ellipse_at_top-left,rgba(200,36,227,0.08),transparent_60%)]"
            />
            <PrescriptionCard
              track={tracks.saturday}
              gradient="bg-[radial-gradient(ellipse_at_top,rgba(200,36,227,0.12),transparent_60%)]"
            />
            <PrescriptionCard
              track={tracks.sunday}
              gradient="bg-[radial-gradient(ellipse_at_top-right,rgba(200,36,227,0.08),transparent_60%)]"
            />
          </div>

          {/* Bottom disclaimer / editorial stamp */}
          <div className="mt-16 border-t border-white/10 pt-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
              Selezione editoriale aggiornata ogni settimana dalla redazione di Milano Beat Radio
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
