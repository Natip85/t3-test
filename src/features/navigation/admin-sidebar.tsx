'use client'
import {FrameIcon, LayoutDashboard, Package, Users2} from 'lucide-react'

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
import {MountainIcon} from './navbar'

const items = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Customers',
    url: '/admin/users',
    icon: Users2,
  },
  {
    title: 'Products',
    url: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    url: '/admin/orders',
    icon: FrameIcon,
  },
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
                <div className='flex items-center justify-center rounded-lg text-sidebar-primary-foreground'>
                  <MountainIcon className='size-8' />
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
