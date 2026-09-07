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
      <figure>
        <Image src={src} alt={media.alt || ''} width={width} height={height} sizes="(max-width: 768px) 100vw, 770px" className="h-auto w-full" />
        {media.caption && <figcaption>{media.caption}</figcaption>}
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
