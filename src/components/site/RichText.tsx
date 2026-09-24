import Image from 'next/image'
import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes, SerializedUploadNode } from '@payloadcms/richtext-lexical'
import type { Media } from '@/src/payload-types'
import { imageUrl } from '@/src/lib/media'

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }: { node: SerializedUploadNode }) => {
    const media = node.value as Media | number
    if (!media || typeof media !== 'object' || !media.url) return null
    const src = imageUrl(media, 'hero')
    if (!src) return null
    const width = media.sizes?.hero?.width || media.width || 1200
    const height = media.sizes?.hero?.height || media.height || 675
    const ratio = width > 0 ? height / width : 1

    // Classify into standardized, uniform aspect-ratios
    const isVertical = ratio >= 1.15
    const isSquare = ratio >= 0.88 && ratio < 1.15

    const containerClasses = isVertical
      ? 'w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5]'
      : isSquare
        ? 'w-full max-w-[380px] aspect-square'
        : 'w-full max-w-[700px] aspect-[16/9]'

    const focalX = typeof media.focalX === 'number' ? media.focalX : 50
    const focalY = typeof media.focalY === 'number' ? media.focalY : 50

    return (
      <figure className="my-8 flex flex-col items-center">
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_15px_40px_rgba(0,0,0,0.8)] ${containerClasses}`}
        >
          <Image
            src={src}
            alt={media.alt || ''}
            fill
            sizes="(max-width: 640px) 100vw, 700px"
            style={{ objectPosition: `${focalX}% ${focalY}%` }}
            className="object-cover"
          />
        </div>
        {media.caption && (
          <figcaption className="mt-2.5 text-center text-sm font-medium text-white/70">
            {media.caption}
          </figcaption>
        )}
      </figure>
    )
  },
})

type Props = { data: unknown; className?: string }

/** Renders a Lexical document from Payload with the site prose styles. */
export function RichText({ data, className = '' }: Props) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText data={data as never} converters={converters} className={`prose-mbr ${className}`} />
}
