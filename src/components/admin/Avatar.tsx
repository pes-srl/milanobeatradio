import Image from 'next/image'

/**
 * Custom Avatar component for the top-right account button in the admin header.
 * Displays signature pink Milano Beat Radio logo with explicit "Logout" label.
 */
export function Avatar() {
  return (
    <div className="mbr-avatar-wrap">
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
      <span className="mbr-avatar__label">Logout</span>
    </div>
  )
}
