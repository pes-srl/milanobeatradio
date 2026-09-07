export function SectionTitle({ children, as: Tag = 'h2', className = '' }: { children: React.ReactNode; as?: 'h1' | 'h2'; className?: string }) {
  return <Tag className={`title-xl text-center ${className}`}>{children}</Tag>
}
