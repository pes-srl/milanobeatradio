import Image from 'next/image'
import Link from 'next/link'
import type { Staff } from '@/src/payload-types'
import { IconPerson } from '@/src/components/icons'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { SocialLinks } from './SocialLinks'

export function StaffCard({ member, priority = false }: { member: Staff; priority?: boolean }) {
  const href = `/staff/${member.slug}`
  const img = imageUrl(member.photo, 'card')
  return (
    <article className="group relative aspect-[4/5] overflow-hidden bg-[#0f0f0f]">
      <Link href={href} className="absolute inset-0" aria-label={member.title}>
        {img && <Image src={img} alt={imageAlt(member.photo, member.title)} fill priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-contain object-top transition duration-500 group-hover:scale-105" />}
        <div className="overlay absolute inset-0" />
        <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border-2 border-white bg-black/40 text-white transition group-hover:bg-brand">
          <IconPerson size={18} />
        </span>
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center">
        {member.role && <span className="tag">{member.role}</span>}
        <h3 className="mt-2 text-2xl font-medium">
          <Link href={href} className="pointer-events-auto hover:text-brand">{member.title}</Link>
        </h3>
        <div className="pointer-events-auto mt-3">
          <SocialLinks socials={member.socials} size="sm" />
        </div>
      </div>
    </article>
  )
}
