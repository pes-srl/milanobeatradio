import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/src/access'

const image = (name: string, label: { it: string; en: string }) => ({
  name,
  type: 'upload' as const,
  relationTo: 'media' as const,
  label,
  filterOptions: { mimeType: { contains: 'image' } },
})

/** Site-wide assets and texts that are not editorial content. Filled by the migration. */
export const Site: GlobalConfig = {
  slug: 'site',
  label: { it: 'Impostazioni sito', en: 'Site settings' },
  admin: {
    group: { it: 'Sistema', en: 'System' },
    description: {
      it: 'Logo, claim, immagini della home e link social: vale per tutto il sito, non è contenuto editoriale.',
      en: 'Logo, claim, home page images and social links: site-wide settings, not editorial content.',
    },
  },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { it: 'Brand', en: 'Brand' },
          fields: [
            image('logo', { it: 'Logo (header)', en: 'Logo (header)' }),
            {
              name: 'heroSlides',
              type: 'array',
              label: { it: 'Slideshow hero (home)', en: 'Hero slideshow (home)' },
              fields: [image('image', { it: 'Immagine', en: 'Image' })],
            },
            { name: 'claim', type: 'text', label: 'Claim', defaultValue: 'Your Event and Party Station' },
            { name: 'hashtag', type: 'text', label: 'Hashtag', defaultValue: '#MBRFRIENDS' },
            { name: 'licenseText', type: 'text', label: { it: 'Testo licenze (footer)', en: 'License text (footer)' } },
          ],
        },
        {
          label: { it: 'Home', en: 'Home' },
          fields: [
            {
              name: 'gallery',
              type: 'array',
              label: { it: 'Mosaico immagini (home)', en: 'Image mosaic (home)' },
              fields: [image('image', { it: 'Immagine', en: 'Image' })],
            },
          ],
        },
        {
          label: { it: 'MBR Events', en: 'MBR Events' },
          fields: [
            image('mbrEventsHero', { it: 'Immagine hero', en: 'Hero image' }),
            {
              name: 'mbrEventsPosters',
              type: 'array',
              label: { it: 'Poster', en: 'Posters' },
              fields: [image('image', { it: 'Immagine', en: 'Image' })],
            },
          ],
        },
        {
          label: { it: 'Social & App', en: 'Social & App' },
          fields: [
            { name: 'instagram', type: 'text', label: 'Instagram', defaultValue: 'https://instagram.com/milanobeatradio_mbr' },
            { name: 'facebook', type: 'text', label: 'Facebook', defaultValue: 'https://facebook.com/milanobeatradio' },
            { name: 'appStoreUrl', type: 'text', label: 'App Store URL' },
            { name: 'playStoreUrl', type: 'text', label: 'Google Play URL' },
          ],
        },
      ],
    },
  ],
}
