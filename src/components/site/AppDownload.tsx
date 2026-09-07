import { IconAndroid, IconApple } from '@/src/components/icons'
import type { Site } from '@/src/payload-types'

/** "ASCOLTACI DALLA NOSTRA APP - SCARICALA" block. Store buttons appear only when the links exist. */
export function AppDownload({ site }: { site: Site | null }) {
  const stores = [
    { href: site?.playStoreUrl, label: 'Google Play', Icon: IconAndroid },
    { href: site?.appStoreUrl, label: 'App Store', Icon: IconApple },
  ].filter((s) => s.href)
  return (
    <section className="px-4 py-20 text-center">
      <h2 className="text-3xl font-medium uppercase leading-tight sm:text-5xl lg:text-6xl">
        Ascoltaci dalla nostra app
        <br />
        scaricala
      </h2>
      {stores.length > 0 ? (
        <div className="mt-10 flex justify-center gap-4">
          {stores.map(({ href, label, Icon }) => (
            <a key={label} href={href!} target="_blank" rel="noreferrer" aria-label={label} className="grid size-16 place-items-center rounded-lg bg-[#16b957] text-white transition hover:brightness-110">
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
