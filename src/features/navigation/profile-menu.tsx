'use client'
import {ChevronRight, Power} from 'lucide-react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {signOut} from 'next-auth/react'
import {cn} from '@/lib/utils'
import {Button} from '@/ui/button'
import {PROFILE_MENU_LINKS} from './constants'

const ProfileMenu = () => {
  const pathname = usePathname()
  return (
    <div className='flex w-full flex-col md:w-[280px] md:min-w-[280px]'>
      {PROFILE_MENU_LINKS.map((link) => {
        const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
        return (
          <Link
            href={link.route}
            key={link.label}
            className={cn(
              'font-button flex items-center justify-between border-b p-3 text-xl',
              isActive ? 'text-primary' : ''
            )}
          >
            <span className='flex items-center gap-3'>
              {isActive ? link.icon : link.iconActive} {link.label}
            </span>
            <span>
              <ChevronRight className='size-5' />
            </span>
          </Link>
        )
      })}
      <Button
        onClick={() => signOut({redirect: true, callbackUrl: '/auth/login'})}
        variant='link'
        className='flex w-fit justify-start text-xl text-destructive hover:text-destructive/80 hover:no-underline'
      >
        <Power className='mr-2 size-5' />
        Logout
      </Button>
    </div>
  )
}

export default ProfileMenu
