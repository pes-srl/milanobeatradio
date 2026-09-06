import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
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
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
