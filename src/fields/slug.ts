import type { Field, FieldHook } from 'payload'

/** Turns any string into a URL-safe slug (Italian accents stripped). */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    return typeof source === 'string' && source.length > 0 ? slugify(source) : value
  }

/**
 * Unique, indexed slug. Auto-generated from `fallbackField` (default `title`)
 * when left empty; always normalised on save.
 */
export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: { it: 'Slug', en: 'Slug' },
  unique: true,
  index: true,
  required: true,
  admin: {
    position: 'sidebar',
    description: {
      it: 'Lasciare vuoto per generarlo dal titolo. Solo lettere minuscole, numeri e trattini.',
      en: 'Leave empty to generate from the title. Lowercase letters, numbers and dashes only.',
    },
  },
  hooks: { beforeValidate: [formatSlug(fallbackField)] },
  validate: (value: unknown) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : 'Slug non valido: usa solo minuscole, numeri e trattini.',
})
