'use client'

import { useState } from 'react'
import type { Show } from '@/src/payload-types'
import { DAY_NAMES_IT, WEEK_ORDER, nowInRome, slotIsOn } from '@/src/lib/format'
import { ShowCard } from './ShowCard'

type Entry = { show: Show; start: string; end: string; dayOfWeek: string }

/** Weekly schedule with day tabs (Lunedì → Domenica). Slots are read from every show. */
export function Schedule({ shows }: { shows: Show[] }) {
  const now = nowInRome()
  const [day, setDay] = useState<string>(now.dayOfWeek)
  const entries: Entry[] = shows
    .flatMap((show) => (show.slots ?? []).map((s) => ({ show, start: s.start, end: s.end, dayOfWeek: s.dayOfWeek })))
    .filter((e) => e.dayOfWeek === day)
    .sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div>
      <div role="tablist" aria-label="Giorno della settimana" className="flex flex-wrap justify-center gap-1 sm:gap-2">
        {WEEK_ORDER.map((d) => (
          <button
            key={d}
            role="tab"
            type="button"
            aria-selected={d === day}
            onClick={() => setDay(d)}
            className={`rounded px-4 py-2.5 text-base font-semibold transition sm:px-6 sm:text-lg ${d === day ? 'bg-brand text-white' : 'text-white hover:text-brand'}`}
          >
            {DAY_NAMES_IT[Number(d)]}
          </button>
        ))}
      </div>
      {entries.length === 0 ? (
        <p className="mt-10 text-center text-white/60">Nessun programma in palinsesto per questo giorno.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e, i) => (
            <ShowCard key={`${e.show.id}-${i}`} show={e.show} start={e.start} end={e.end} onAir={day === now.dayOfWeek && slotIsOn(e, now)} />
          ))}
        </div>
      )}
    </div>
  )
}
