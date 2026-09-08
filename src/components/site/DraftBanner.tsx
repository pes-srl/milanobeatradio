/**
 * Shown on a page opened through the admin "Anteprima" button. Without it, Next draft
 * mode stays on silently for the rest of the browsing session and an editor could take
 * an unpublished draft for a live page.
 */
export function DraftBanner({ path }: { path: string }) {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-brand px-4 py-2 text-center text-sm font-semibold text-white">
      <span>Anteprima: stai vedendo una bozza non pubblicata.</span>
      <a href={`/api/preview/exit?path=${encodeURIComponent(path)}`} className="underline underline-offset-2">
        Esci dall’anteprima
      </a>
    </div>
  )
}
