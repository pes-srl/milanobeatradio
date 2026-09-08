import type { Field } from 'payload'

/**
 * Engagement counters carried over from the Pro.Radio theme (`proradio_reaktions_*`).
 * The migration seeds them with the WordPress totals so the numbers on the cards keep
 * their history, and app/(site)/api/stats/route.ts increments them live from then on.
 * Editable here, but rarely worth touching by hand.
 */
export const statsField: Field = {
  name: 'stats',
  type: 'group',
  label: { it: 'Statistiche', en: 'Stats' },
  admin: {
    position: 'sidebar',
    description: {
      it: 'Partono dai numeri importati da WordPress e da lì crescono da soli con le visite reali. Si possono correggere a mano, ma raramente serve.',
      en: 'Seeded with the WordPress totals, then incremented live by real visits. Editable by hand, but rarely worth it.',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'views', type: 'number', label: { it: 'Visualizzazioni', en: 'Views' }, min: 0, defaultValue: 0, admin: { width: '34%' } },
        { name: 'likes', type: 'number', label: { it: 'Mi piace', en: 'Likes' }, min: 0, defaultValue: 0, admin: { width: '33%' } },
        { name: 'shares', type: 'number', label: { it: 'Condivisioni', en: 'Shares' }, min: 0, defaultValue: 0, admin: { width: '33%' } },
      ],
    },
  ],
}
