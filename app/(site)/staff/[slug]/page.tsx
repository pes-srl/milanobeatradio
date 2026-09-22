import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/src/components/site/RichText'
import { SocialLinks } from '@/src/components/site/SocialLinks'
import { StatsBar } from '@/src/components/site/StatsBar'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { getStaffMember } from '@/src/lib/queries'
import { extractYoutubeFromBio } from '@/src/lib/youtube'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const member = await getStaffMember(slug)
  if (!member) return {}
  return { title: member.title, openGraph: { images: imageUrl(member.photo, 'hero') ? [imageUrl(member.photo, 'hero')!] : undefined } }
}

export default async function StaffMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const member = await getStaffMember(slug, isDraft)
  if (!member) notFound()

  const { embedUrl: youtubeUrl, cleanedBio } = extractYoutubeFromBio(member.bio)
  const img = imageUrl(member.photo, 'hero')

  return (
    <div className="relative min-h-screen bg-black text-white">
      {isDraft && <DraftBanner path={`/staff/${slug}`} />}

      {/* Ambient background glow */}
      {img && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden opacity-25">
          <Image
            src={img}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/staff"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:text-brand"
          >
            ← Tutto il team
          </Link>
        </div>

        {/* Profile Showcase Grid */}
        <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-12 items-start lg:items-center">
          {/* Left Column: Full Portrait Photo (clean, no text covering the person) */}
          <div className="mx-auto w-full max-w-[400px] lg:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_15px_50px_rgba(0,0,0,0.9)] sm:aspect-[4/5]">
              {img ? (
                <Image
                  src={img}
                  alt={imageAlt(member.photo, member.title)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="size-full bg-gradient-to-br from-brand-dark to-black" />
              )}
            </div>
          </div>

          {/* Right Column: Dedicated Info Panel */}
          <div className="flex flex-col space-y-6">
            {/* Role Badge */}
            {member.role && (
              <div>
                <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                  {member.role}
                </span>
              </div>
            )}

            {/* Name */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {member.title}
            </h1>

            {/* Social Links */}
            {member.socials && (
              <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                  Canali Social
                </p>
                <SocialLinks socials={member.socials} size="md" />
              </div>
            )}

            {/* Stats Bar */}
            <div className="border-t border-white/10 pt-4">
              <StatsBar
                collection="staff"
                id={member.id}
                title={member.title}
                views={member.stats?.views}
                likes={member.stats?.likes}
                shares={member.stats?.shares}
              />
            </div>
          </div>
        </div>

        {/* Embedded YouTube Window (if present) */}
        {youtubeUrl && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="border-b border-white/10 bg-white/5 px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Video Ufficiale · {member.title}
              </span>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={youtubeUrl}
                title={`Video YouTube di ${member.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
          </div>
        )}

        {/* Bio Section (if any) */}
        {cleanedBio ? (
          <div className="mt-12 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-wider text-white">Biografia</h2>
            <article className="prose prose-invert max-w-none text-white/90">
              <RichText data={cleanedBio} />
            </article>
          </div>
        ) : null}
      </main>
    </div>
  )
}
