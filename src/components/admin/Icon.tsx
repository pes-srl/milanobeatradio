import Image from 'next/image'

/** Small brand mark in the admin nav header. */
export function Icon() {
  return <Image src="/mbr-logo-v2.png" alt="Milano Beat Radio" width={44} height={44} className="mbr-icon" />
}
