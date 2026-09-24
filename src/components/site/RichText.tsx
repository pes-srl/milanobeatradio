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
    return (
      <figure className="my-8 flex flex-col items-center">
        <div className="relative inline-block max-w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <Image
            src={src}
            alt={media.alt || ''}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 600px"
            className="block h-auto max-h-[580px] w-auto max-w-full object-contain"
          />
        </div>
        {media.caption && <figcaption className="mt-2.5 text-center text-sm font-medium text-white/70">{media.caption}</figcaption>}
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
