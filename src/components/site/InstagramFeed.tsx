'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Site } from '@/src/payload-types'
import type { InstagramFeedData, InstagramMediaItem } from '@/src/lib/instagram'
import { IconExternal, IconInstagram } from '@/src/components/icons'
import { SectionTitle } from './SectionTitle'

type Props = {
  site?: Site | null
  feed?: InstagramFeedData | null
}

const INSTAGRAM_URL = 'https://www.instagram.com/milanobeatradio_mbr/'

function formatFollowers(num?: number): string {
  if (!num) return '11.6K'
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`.replace('.0K', 'K')
  }
  return num.toString()
}

function formatPostDate(isoString?: string): string {
  if (!isoString) return 'In evidenza'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return 'Recente'
  }
}

/**
 * Returns the proper cover image URL for a post.
 * For VIDEO / Reels, thumbnail_url is the static JPEG cover, whereas media_url is an MP4 video stream!
 */
function getMediaCover(item?: InstagramMediaItem | null): string | null {
  if (!item) return null
  if (item.media_type === 'VIDEO') {
    return item.thumbnail_url || item.media_url || null
  }
  return item.media_url || item.thumbnail_url || null
}

/**
 * Native Instagram Feed & Social Hub component.
 * 100% dark theme (pure black and nocturnal purple tones, zero white borders),
 * powered by official Meta Graph API with ISR server-side caching.
 */
export function InstagramFeed({ site, feed }: Props) {
  const instagramLink = site?.instagram || INSTAGRAM_URL

  const profile = feed?.profile
  const posts = feed?.posts && feed.posts.length > 0 ? feed.posts : []
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Fallback for featured post if no API posts are loaded yet
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featured = (site as any)?.instagramFeatured
  const featuredImage =
    featured?.image && typeof featured.image === 'object' && 'url' in featured.image ? featured.image : null

  const activePost: InstagramMediaItem | null = posts[selectedIndex] || null

  const displayImageUrl =
    getMediaCover(activePost) ||
    featuredImage?.sizes?.card?.url ||
    featuredImage?.url ||
    null

  const displayPostUrl = activePost?.permalink || featured?.postUrl || instagramLink
  const displayCaption =
    activePost?.caption ||
    featured?.caption ||
    profile?.biography ||
    '📻 Web City Radio, based Milano. Un partner che amplifica e realizza i tuoi eventi! Eventi aziendali, djset, home parties, soft clubbing. #MBRFRIENDS'
  const displayLikes = activePost?.like_count !== undefined ? activePost.like_count : (featured?.likes || '348')
  const displayDate = activePost?.timestamp ? formatPostDate(activePost.timestamp) : (featured?.dateLabel || 'IN EVIDENZA')
  const isVideo = activePost?.media_type === 'VIDEO'
  const isCarousel = activePost?.media_type === 'CAROUSEL_ALBUM'

  const profileAvatar = profile?.profile_picture_url || '/mbr-logo-v2.png'
  const followersCount = formatFollowers(profile?.followers_count)
  const mediaCount = profile?.media_count || 299
  const followsCount = profile?.follows_count || 881

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#080312] to-black px-4 py-24 sm:px-8">
      {/* Lightweight ambient glow background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_25%,rgba(200,36,227,0.12),transparent_70%),radial-gradient(ellipse_70%_50%_at_85%_75%,rgba(224,36,111,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Eyebrow badge */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink/40 bg-pink/10 px-5 py-1.5 shadow-[0_0_15px_rgba(224,36,111,0.25)]">
            <span className="size-2 rounded-full bg-pink animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink sm:text-sm">
              Live Instagram Feed & Social Hub
            </span>
          </div>
        </div>

        <SectionTitle>MBR on Instagram</SectionTitle>

        {/* 1. Profile Summary Card */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-[#0c0418]/90 p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(200,36,227,0.12)] sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* Instagram Stories Gradient Ring Avatar */}
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="group relative flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] shadow-[0_0_20px_rgba(220,39,67,0.35)] transition-transform duration-300 hover:scale-105"
                aria-label="Profilo Instagram Milano Beat Radio"
              >
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-black p-1 transition-transform duration-300 group-hover:scale-95">
                  <Image
                    src={profileAvatar}
                    alt="Milano Beat Radio"
                    width={72}
                    height={72}
                    className="size-full rounded-full object-cover"
                    unoptimized={profileAvatar.startsWith('http')}
                  />
                </div>
                <span className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-[#0095f6] text-[10px] font-bold text-white ring-2 ring-black">
                  ✓
                </span>
              </a>

              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xl font-bold tracking-tight text-white transition-colors hover:text-pink sm:text-2xl"
                  >
                    @{profile?.username || 'milanobeatradio_mbr'}
                  </a>
                  <span className="rounded-full bg-pink/20 px-2.5 py-0.5 text-[11px] font-semibold text-pink">
                    Official Page
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold sm:justify-start">
                  <span className="text-white font-bold">{followersCount} <span className="text-white/60 font-normal">Follower</span></span>
                  <span className="text-white font-bold">{mediaCount} <span className="text-white/60 font-normal">Post</span></span>
                  <span className="text-white font-bold">{followsCount} <span className="text-white/60 font-normal">Seguiti</span></span>
                </div>

                <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl">
                  {profile?.biography || '📻 Web City Radio, based Milano. Un 🤝 partner che amplifica e realizza i tuoi eventi! 🎊🎉 Eventi aziendali 🎧 djset 🕵🏻home🏠parties, soft clubbing.'}
                </p>
              </div>
            </div>

            {/* Follow Button */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(225,48,108,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(225,48,108,0.7)] active:scale-95 shrink-0"
            >
              <IconInstagram size={18} variant="glyph" className="text-white" />
              <span>Segui su IG</span>
            </a>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-5 sm:justify-start">
            <a
              href="https://www.instagram.com/milanobeatradio_mbr/reels/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-brand hover:bg-brand/20 hover:text-white"
            >
              <span>⚡ Guarda i Reel</span>
              <IconExternal size={14} />
            </a>
            <a
              href="https://www.instagram.com/milanobeatradio_mbr/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-pink hover:bg-pink/20 hover:text-white"
            >
              <span>📸 Post & Foto</span>
              <IconExternal size={14} />
            </a>
            <span className="hidden sm:inline-block text-xs font-medium text-white/50">
              #MBRFRIENDS · Taggaci nei tuoi post e reel per essere ripubblicato
            </span>
          </div>
        </div>

        {/* 2. Main Featured Post Card (100% Dark, zero white borders) */}
        <div className="relative mx-auto mt-12 max-w-[560px]">
          {/* Subtle neon backlight glow */}
          <div className="pointer-events-none absolute -inset-1.5 rounded-[30px] bg-gradient-to-tr from-pink/30 via-brand/20 to-pink/15 opacity-80 blur-xl" />

          <div className="relative z-10 overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-b from-[#140624] via-[#0d0319] to-[#06010c] shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(200,36,227,0.22)]">
            {/* Header: Avatar + Username + Follow */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3.5 text-left"
              >
                <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-[0_0_12px_rgba(220,39,67,0.35)]">
                  <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-black p-0.5">
                    <Image
                      src={profileAvatar}
                      alt="Milano Beat Radio"
                      width={40}
                      height={40}
                      className="size-full rounded-full object-cover"
                      unoptimized={profileAvatar.startsWith('http')}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold tracking-tight text-white group-hover:text-pink transition-colors">
                      milanobeatradio_mbr
                    </span>
                    <span className="flex size-3.5 items-center justify-center rounded-full bg-[#0095f6] text-[8px] font-bold text-white">
                      ✓
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-white/50">Milano, Italy · Web City Radio</span>
                </div>
              </a>

              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(225,48,108,0.35)] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <span>Segui</span>
              </a>
            </div>

            {/* Media: Photo or Video cover */}
            <a
              href={displayPostUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square w-full overflow-hidden bg-black"
            >
              {displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt={displayCaption ? displayCaption.slice(0, 100) : 'Post Milano Beat Radio'}
                  fill
                  sizes="(max-width: 640px) 100vw, 560px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                  unoptimized={displayImageUrl.startsWith('http')}
                />
              ) : (
                /* High-impact branded fallback visual */
                <div className="flex size-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(55,14,78,0.95)_0%,rgba(10,3,18,0.98)_100%)] p-8 text-center">
                  <div className="relative mb-4 flex size-28 items-center justify-center rounded-full border-2 border-pink/60 bg-black/50 p-4 shadow-[0_0_35px_rgba(224,36,111,0.55)] transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src="/mbr-logo-v2.png"
                      alt="Milano Beat Radio"
                      width={80}
                      height={80}
                      className="size-full object-contain filter drop-shadow-[0_0_14px_rgba(224,36,111,0.85)]"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink">Live on Air & Social</span>
                  <h3 className="mt-1 text-xl font-black tracking-wide text-white">MILANO BEAT RADIO</h3>
                  <p className="mt-1 text-xs text-white/60">Your Event & Party Station</p>
                </div>
              )}

              {/* Media Type Badge top right */}
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/10 shadow-lg">
                <IconInstagram size={14} variant="glyph" className="text-pink" />
                <span>
                  {isVideo ? '⚡ REEL' : isCarousel ? '📸 ALBUM' : 'INSTAGRAM'}
                </span>
              </div>

              {/* Play button overlay for Reel/Video */}
              {isVideo && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex size-14 sm:size-16 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(224,36,111,0.5)] transition-transform duration-300 group-hover:scale-110">
                    <svg className="size-7 sm:size-8 translate-x-0.5 text-pink" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-2 rounded-full border border-pink/80 bg-gradient-to-r from-pink to-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_22px_rgba(224,36,111,0.85)] transform transition-transform duration-300 group-hover:scale-105">
                  <IconInstagram size={16} variant="glyph" />
                  <span>Vedi post su Instagram ↗</span>
                </span>
              </div>
            </a>

            {/* Action Icons Bar */}
            <div className="flex items-center justify-between px-5 pt-3.5 pb-2">
              <div className="flex items-center gap-4">
                <a
                  href={displayPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-1.5 text-white/80 transition-colors hover:text-pink"
                  aria-label="Mi piace"
                >
                  <svg className="size-6 text-pink transition-transform duration-200 group-hover:scale-125" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </a>
                <a
                  href={displayPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 transition-colors hover:text-pink"
                  aria-label="Commenta su Instagram"
                >
                  <svg className="size-6 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
                <a
                  href={displayPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 transition-colors hover:text-pink"
                  aria-label="Condividi"
                >
                  <svg className="size-6 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </a>
              </div>

              <a
                href={displayPostUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white/70 hover:text-pink transition-colors"
                aria-label="Salva su Instagram"
              >
                <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </a>
            </div>

            {/* Likes & Caption */}
            <div className="px-5 pb-5 pt-1 text-left">
              <p className="text-xs font-bold text-white">
                Piace a <span className="text-pink">{displayLikes} persone</span>
              </p>

              <p className="mt-2 text-xs sm:text-sm text-white/85 line-clamp-3 leading-relaxed">
                <span className="font-bold text-white mr-1.5">milanobeatradio_mbr</span>
                {displayCaption}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">
                  {displayDate}
                </span>

                <a
                  href={displayPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-pink hover:text-white transition-colors"
                >
                  Vedi su Instagram ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Interactive Recent Posts Thumbnails Bar (Click to switch active post) */}
        {posts.length > 1 && (
          <div className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-3.5">
              Ultimi contenuti pubblicati (seleziona per visualizzare)
            </p>

            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 px-2">
              {posts.map((post, idx) => {
                const img = getMediaCover(post)
                const isCurrent = idx === selectedIndex
                return (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`group relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 bg-black ${
                      isCurrent
                        ? 'border-pink shadow-[0_0_15px_rgba(224,36,111,0.6)] scale-105'
                        : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                    }`}
                    aria-label={`Visualizza post ${idx + 1}`}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt="Miniatura post"
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={img.startsWith('http')}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-black/90 p-2 text-center text-[10px] text-white/60">
                        MBR
                      </div>
                    )}
                    {post.media_type === 'VIDEO' && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center rounded bg-black/85 px-1 py-0.5 text-[9px] font-bold text-pink shadow">
                        ▶
                      </span>
                    )}
                    {post.media_type === 'CAROUSEL_ALBUM' && (
                      <span className="absolute bottom-1 right-1 flex items-center justify-center rounded bg-black/85 px-1 py-0.5 text-[9px] font-bold text-white shadow">
                        ⧉
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. Bottom CTA Button */}
        <div className="mt-14 text-center">
          <a
            href={instagramLink}
            target="_blank"
            rel="noreferrer"
            className="btn-pill inline-flex items-center gap-3 px-8 py-3.5 shadow-[0_0_20px_rgba(200,36,227,0.35)]"
          >
            <IconInstagram size={20} />
            <span>Visita il profilo completo @milanobeatradio_mbr</span>
          </a>
        </div>
      </div>
    </section>
  )
}
