import {AdminSidebar} from '@/features/navigation/admin-sidebar'
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/ui/sidebar'
import {cookies} from 'next/headers'
import {Suspense} from 'react'
import {Loader2} from 'lucide-react'
import PermissionGuard from '@/components/permissions-guard'

export default async function AdminLayout({children}: {children: React.ReactNode}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center'>
          <Loader2 className='size-20 animate-spin' />
        </div>
      }
    >
      <PermissionGuard requiredRoles={['admin', 'investigator', 'owner', 'paid', 'staff']}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AdminSidebar />
          <SidebarInset>
            <SidebarTrigger />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </PermissionGuard>
    </Suspense>
  )
}
