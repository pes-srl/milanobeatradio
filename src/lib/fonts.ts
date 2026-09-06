import localFont from 'next/font/local'

/** Poppins, self-hosted (OFL). Files copied from @fontsource/poppins into public/fonts. */
export const poppins = localFont({
  variable: '--font-poppins',
  display: 'swap',
  src: [
    { path: '../../public/fonts/poppins-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/poppins-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/poppins-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/poppins-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/poppins-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
})
