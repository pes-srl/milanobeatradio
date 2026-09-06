/**
 * Server-rendered timestamp. It changes on every navigation, proving the page
 * re-rendered while the audio element in the layout stayed mounted.
 */
export function RenderStamp({ label }: { label: string }) {
  return (
    <p className="text-xs text-white/40" data-testid="render-stamp">
      {label} renderizzata alle {new Date().toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome' })}
    </p>
  )
}
