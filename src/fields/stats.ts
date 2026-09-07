import type { Field } from 'payload'

/**
 * Engagement counters carried over from the Pro.Radio theme (`proradio_reaktions_*`).
 * These are historical totals from the WordPress site: the migration fills them once so
 * the numbers shown on cards match what readers saw before. They are editable but not
 * incremented automatically — live counting is a separate decision (see TASKS-HUMANAS.md).
 */
export const statsField: Field = {
  name: 'stats',
  type: 'group',
  label: { it: 'Statistiche', en: 'Stats' },
  admin: {
    position: 'sidebar',
    description: {
      it: 'Contatori storici importati da WordPress. Non si aggiornano da soli.',
      en: 'Historical counters imported from WordPress. Not incremented automatically.',
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
