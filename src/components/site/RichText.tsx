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
    const isWide = !isVertical && !isSquare

    const containerClasses = isVertical
      ? 'w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] mx-auto'
      : isSquare
        ? 'w-full max-w-[400px] sm:max-w-[440px] aspect-square mx-auto'
        : 'w-full aspect-[16/10] sm:aspect-[16/9]'

    const focalX = typeof media.focalX === 'number' ? media.focalX : 50
    const focalY = typeof media.focalY === 'number' ? media.focalY : 50

    return (
      <figure
        className={`my-12 sm:my-16 flex flex-col items-center ${
          isWide
            ? 'w-full sm:-mx-8 sm:w-[calc(100%+4rem)] md:-mx-16 md:w-[calc(100%+8rem)]'
            : 'w-full max-w-[480px] mx-auto'
        }`}
      >
        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.03] p-2.5 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group">
          <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl ${containerClasses}`}>
            <Image
              src={src}
              alt={media.alt || ''}
              fill
              sizes="(max-width: 640px) 100vw, 1000px"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          {media.caption && (
            <figcaption className="mt-3 text-center text-xs sm:text-sm font-medium italic text-white/70 tracking-wide">
              {media.caption}
            </figcaption>
          )}
        </div>
      </figure>
    )
  },
})

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalDoc = {
  root?: {
    children?: LexicalNode[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

/** Cleans empty paragraph nodes created by excessive line breaks in the editor. */
function cleanLexicalData(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data
  const doc = data as LexicalDoc
  if (!doc.root || !Array.isArray(doc.root.children)) return data

  const cleanedChildren = doc.root.children.filter((child) => {
    if (child.type === 'paragraph') {
      if (!child.children || child.children.length === 0) return false
      const isEmpty = child.children.every(
        (c) => c.type === 'linebreak' || (c.type === 'text' && (!c.text || c.text.trim() === ''))
      )
      if (isEmpty) return false
    }
    return true
  })

  return {
    ...doc,
    root: {
      ...doc.root,
      children: cleanedChildren,
    },
  }
}

type Props = { data: unknown; className?: string }

/** Renders a Lexical document from Payload with the site prose styles. */
export function RichText({ data, className = '' }: Props) {
  if (!data || typeof data !== 'object') return null
  const cleaned = cleanLexicalData(data)
  return <LexicalRichText data={cleaned as never} converters={converters} className={`prose-mbr ${className}`} />
}
