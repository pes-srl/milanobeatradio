import Image from 'next/image'

/** Brand mark on the admin login screen, in place of the default Payload logotype. */
export function Logo() {
  return (
    <div className="mbr-brand mbr-brand--large">
      <Image src="/mbr-logo.png" alt="Milano Beat Radio" width={120} height={120} priority />
      <span>Milano Beat Radio</span>
    </div>
  )
}
