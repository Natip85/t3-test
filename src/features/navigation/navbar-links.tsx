import Link from 'next/link'
import React from 'react'
import {USER_NAV_ITEMS} from './constants'

type Props = {}

export default function NavbarLinks({}: Props) {
  return (
    <nav className='hidden items-center gap-6 text-sm font-medium md:flex'>
      {USER_NAV_ITEMS.map((item) => (
        <Link
          key={item.title}
          href={item.path}
          className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
          prefetch={false}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
