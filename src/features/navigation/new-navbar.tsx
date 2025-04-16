'use client'
import {Menu, MenuIcon, MountainIcon} from 'lucide-react'
import {type Variants, motion, useMotionValueEvent, useScroll} from 'motion/react'
import Link from 'next/link'
import {useRef, useState} from 'react'
import NavbarSearch from './navbar-search'
import {ThemeToggle} from './theme-toggle'
import {hasRole} from '@/lib/permissions'
import {Button} from '@/ui/button'
import UserAccountNav from './user-account-nav'
import {Sheet, SheetContent, SheetTrigger} from '@/ui/sheet'
import MobileNavbarLinks from './mobile-navbar-links'
import {useUser} from '@/hooks/use-user'
import NavbarLinks from './navbar-links'

export default function NewNavbar() {
  const [hidden, setHidden] = useState(false)
  const {scrollY} = useScroll()
  const lastYRef = useRef(0)
  const {user, isAuthenticated} = useUser()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const difference = y - lastYRef.current
    if (Math.abs(difference) > 50) {
      setHidden(difference > 0)
      lastYRef.current = y
    }
  })
  return (
    <div>
      <motion.div
        animate={hidden ? 'hidden' : 'visible'}
        initial='visible'
        whileHover={hidden ? 'peeking' : 'visible'}
        onFocusCapture={hidden ? () => setHidden(false) : undefined}
        variants={
          {
            visible: {y: '0%'},
            hidden: {y: '-75%'},
            peeking: {y: '0%', cursor: 'pointer'},
          } as Variants
        }
        transition={{duration: 0.2}}
        className='fixed top-0 z-[1000] hidden w-full items-center justify-center space-x-10 pt-3 md:flex'
      >
        <div className='container mx-auto flex h-16 max-w-6xl items-center justify-between gap-10 rounded-3xl border p-5 px-4 *:rounded-xl md:px-6'>
          <Link href='/' className='flex items-center gap-2' prefetch={false}>
            <MountainIcon className='h-6 w-6' />
            <span className='sr-only'>Acme Inc</span>
          </Link>
          <NavbarLinks />
          <div className='flex items-center gap-3'>
            <NavbarSearch />
            <ThemeToggle />
            {hasRole(user, ['admin', 'investigator', 'owner', 'staff']) && (
              <Button asChild size='sm' className='hidden md:flex'>
                <Link href='/admin/users'>ADMIN</Link>
              </Button>
            )}
            <span className='hidden md:block'>{isAuthenticated && <UserAccountNav />}</span>
            {!isAuthenticated && (
              <Button asChild size='sm' className='hidden md:flex'>
                <Link href='/auth/login'>LOG IN</Link>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild className='md:hidden'>
                <Button variant='ghost' size='icon' className='rounded-full'>
                  <MenuIcon className='size-5' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='flex flex-col justify-between gap-10 md:hidden'>
                {!isAuthenticated && (
                  <Button asChild size='sm'>
                    <Link href='/auth/login'>LOG IN</Link>
                  </Button>
                )}
                <div className='flex justify-center'>{isAuthenticated && <UserAccountNav />}</div>

                <MobileNavbarLinks />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
      <div className='fixed left-0 right-0 top-0 z-[1001] flex items-center justify-end p-3 md:hidden'>
        <Menu className='size-[2.3rem] rotate-180 cursor-pointer text-white md:hidden' />
      </div>
    </div>
  )
}
