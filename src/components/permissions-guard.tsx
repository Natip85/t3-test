import {type ReactNode} from 'react'
import {hasPermission, hasRole, type PermissionType, type Permissions} from '@/lib/permissions'
import {api} from '@/trpc/server'
import {Button} from '@/ui/button'
import Link from 'next/link'
import {type UserRole} from '@/server/db/schema'

type PermissionGuardProps<Resource extends PermissionType> = {
  children: ReactNode
} & (
  | {
      resource: Resource
      action: Permissions[Resource]['action']
      requiredRoles?: never
    }
  | {
      resource?: never
      action?: never
      requiredRoles: UserRole[]
    }
)

export default async function PermissionGuard<Resource extends PermissionType>({
  children,
  resource,
  action,
  requiredRoles,
}: PermissionGuardProps<Resource>) {
  const user = await api.users.getMe()

  if (
    hasRole(user, 'blocked') ||
    (requiredRoles && !hasRole(user, requiredRoles)) ||
    (resource && action && !hasPermission(user, resource, action))
  ) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col gap-5'>
          <p>You do not have the right permissions to view this page</p>
          <Button asChild>
            <Link href='..' className='text-sm'>
              Go back to previous page
            </Link>
          </Button>
          <Button asChild>
            <Link href={'/'}>Go back to home page</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
