import Image from 'next/image'

/** Brand mark on the admin login screen, in place of the default Payload logotype. */
export function Logo() {
  return (
    <div className="mbr-brand">
      <Image src="/mbr-logo.png" alt="Milano Beat Radio" width={320} height={320} priority />
    </div>
  )
}
