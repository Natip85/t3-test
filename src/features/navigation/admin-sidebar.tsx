'use client'
import {Users2} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import AdminSidebarMenuActiveButton from './admin-sidebar-menu-active-button'
import AdminSidebarUserMenu from './admin-sidebar-user-menu'
import Link from 'next/link'
import SidebarLogo from '@/assets/logoMobile.svg'

const items = [
  {
    title: 'users',
    url: '/admin/users',
    icon: Users2,
  },
  // {
  //   title: 'incidents',
  //   url: '/admin/incidents',
  //   icon: FrameIcon,
  // },
  // {
  //   title: 'offenders',
  //   url: '/admin/offenders',
  //   icon: ShieldBanIcon,
  // },
]

export function AdminSidebar() {
  return (
    <Sidebar collapsible='icon' variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              asChild
            >
              <Link href='/'>
                <div className='text-sidebar-primary-foreground flex items-center justify-center rounded-lg'>
                  <SidebarLogo />
                </div>
                <div className='flex h-full flex-col justify-end text-left text-sm leading-tight'>
                  <span className='truncate text-xs'>T3 Testing</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <AdminSidebarMenuActiveButton href={item.url} title={item.title} icon={<item.icon />} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AdminSidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
