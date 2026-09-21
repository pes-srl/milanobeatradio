import { IconAndroid, IconApple } from '@/src/components/icons'
import type { Site } from '@/src/payload-types'

/** "ASCOLTACI DALLA NOSTRA APP - SCARICALA" block. Store buttons appear only when the links exist. */
export function AppDownload({ site }: { site: Site | null }) {
  const stores = [
    {
      href: site?.playStoreUrl,
      label: 'Google Play',
      Icon: IconAndroid,
      cls: 'bg-[#01875f] text-white hover:brightness-110 shadow-[0_4px_16px_rgba(1,135,95,0.4)]',
    },
    {
      href: site?.appStoreUrl,
      label: 'App Store',
      Icon: IconApple,
      cls: 'bg-black text-white border border-white/20 hover:border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.6)]',
    },
  ].filter((s) => s.href)
  return (
    <section className="px-4 py-20 text-center">
      <h2 className="text-3xl font-bold uppercase tracking-wide leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
        Ascoltaci dalla nostra app
        <br />
        scaricala
      </h2>
      {stores.length > 0 ? (
        <div className="mt-10 flex justify-center gap-4">
          {stores.map(({ href, label, Icon, cls }) => (
            <a key={label} href={href!} target="_blank" rel="noreferrer" aria-label={label} className={`grid size-16 place-items-center rounded-2xl transition hover:scale-105 active:scale-95 ${cls}`}>
              <Icon size={30} />
            </a>
          ))}
        </div>
      ) : (
        // TODO: store links missing (TASKS-HUMANAS.md). Shown as plain text until then.
        <p className="mt-6 text-white/60">Presto disponibile su App Store e Google Play.</p>
      )}
    </section>
  )
}
