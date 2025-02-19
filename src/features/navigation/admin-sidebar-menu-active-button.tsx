'use client'
import {SidebarMenuButton} from '@/ui/sidebar'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export default function AdminSidebarMenuActiveButton({
  href,
  icon,
  title,
}: {
  href: string
  icon: React.ReactNode
  title: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}
