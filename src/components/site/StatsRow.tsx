import { IconCalendar, IconEye, IconHeart, IconShare } from '@/src/components/icons'
import { fmtDate } from '@/src/lib/format'

type Stats = { views?: number | null; likes?: number | null; shares?: number | null } | null | undefined

/** Date + engagement counters, laid out like the original theme's card meta line. */
export function StatsRow({ date, stats, className = '' }: { date?: string | null; stats: Stats; className?: string }) {
  const items = [
    { icon: IconEye, value: stats?.views },
    { icon: IconHeart, value: stats?.likes },
    { icon: IconShare, value: stats?.shares },
  ].filter((i) => typeof i.value === 'number' && i.value > 0)

  if (!date && items.length === 0) return null

  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-white/90 ${className}`}>
      {date && (
        <span className="flex items-center gap-1.5">
          <IconCalendar size={13} className="text-brand" />
          {fmtDate(date)}
        </span>
      )}
      {items.map(({ icon: Icon, value }, i) => (
        <span key={i} className="flex items-center gap-1">
          <Icon size={13} className="text-brand" />
          {value}
        </span>
      ))}
    </p>
  )
}
