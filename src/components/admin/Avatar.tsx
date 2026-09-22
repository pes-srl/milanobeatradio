import Image from 'next/image'

/**
 * Custom Avatar component for the top-right account button in the admin header.
 * Replaces the default grey user placeholder with the signature pink Milano Beat Radio logo.
 */
export function Avatar() {
  return (
    <div className="mbr-avatar">
      <Image
        src="/mbr-logo-v2.png"
        alt="Milano Beat Radio"
        width={32}
        height={32}
        className="mbr-avatar__img"
        priority
      />
    </div>
  )
}
