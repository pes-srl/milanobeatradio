import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

// Inline images inside rich text are stored as /media/<file>. In production they live on R2,
// in local dev on disk behind Payload's static route. One rewrite keeps the content stable.
const r2Enabled = process.env.R2_ENABLED !== 'false' && Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
const mediaOrigin = r2Enabled ? `${(process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')}/media` : '/api/media/file'

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/media/:path*', destination: `${mediaOrigin}/:path*` }]
  },
  reactStrictMode: true,
  // The dev indicator defaults to bottom-left, right on top of the fixed player bar.
  devIndicators: { position: 'top-right' },
  images: {
    // AVIF first, WebP fallback. Every <Image> must pass an explicit `sizes`.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'media.milanobeatradio.it' },
      // AzuraCast album art for the "now playing" widget
      { protocol: 'https', hostname: 'canali.pesstream.eu' },
      // Local dev only: media served from Payload's own API when R2 is disabled.
      ...(process.env.NODE_ENV !== 'production' ? [{ protocol: 'http' as const, hostname: 'localhost' }] : []),
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
