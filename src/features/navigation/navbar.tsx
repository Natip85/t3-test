'use client'
import type React from 'react'
import Link from 'next/link'
import NavbarLinks from './navbar-links'
import NavbarSearch from './navbar-search'
import {ThemeToggle} from './theme-toggle'
import {hasRole} from '@/lib/permissions'
import UserAccountNav from './user-account-nav'
import CartIcon from '../cart/cart-icon'
import {Button} from '@/ui/button'
import {Sheet, SheetContent, SheetTrigger} from '@/ui/sheet'
import MobileNavbarLinks from './mobile-navbar-links'
import {useUser} from '@/hooks/use-user'
import {Suspense} from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

const MenuIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  )
}

export const MountainIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m8 3 4 8 5-5 5 15H2L8 3z' />
    </svg>
  )
}
export default function Navbar() {
  const {user, isAuthenticated} = useUser()
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950'>
      <div className='mx-auto flex h-16 items-center justify-between gap-6 px-6 lg:px-12'>
        <div className='flex items-center gap-10'>
          <Link href='/' className='hidden items-center gap-2 lg:flex' prefetch={false}>
            <MountainIcon className='h-6 w-6' />
            <span className='sr-only'>Acme Inc</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild className='lg:hidden'>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <MenuIcon className='size-5' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='flex flex-col justify-between gap-10 lg:hidden'>
              <div>
                <Link href='/' className='flex items-center gap-5' prefetch={false}>
                  <MountainIcon className='h-6 w-6' /> T3-TEST
                  <span className='sr-only'>Acme Inc</span>
                </Link>
              </div>
              {!isAuthenticated && (
                <Button asChild size='sm'>
                  <Link href='/auth/login'>LOG IN</Link>
                </Button>
              )}
              <div className='flex justify-center'>{isAuthenticated && <UserAccountNav />}</div>

              <MobileNavbarLinks />
            </SheetContent>
          </Sheet>
          <NavbarLinks />
        </div>
        <div className='flex max-w-2xl flex-1'>
          <Suspense fallback={<div>Loading search...</div>}>
            <NavbarSearch />
          </Suspense>
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
          <ThemeToggle />
          {hasRole(user, ['admin', 'investigator', 'owner', 'staff']) && (
            <Button asChild size='sm' className='hidden lg:flex'>
              <Link href='/admin/users'>ADMIN</Link>
            </Button>
          )}
          <span className='hidden lg:block'>{isAuthenticated && <UserAccountNav />}</span>
          {!isAuthenticated && (
            <Button asChild size='sm' className='hidden lg:flex'>
              <Link href='/auth/login'>LOG IN</Link>
            </Button>
          )}
          <CartIcon />
        </div>
      </div>
    </header>
  )
}
