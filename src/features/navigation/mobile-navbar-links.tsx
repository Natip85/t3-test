import Link from 'next/link'
import {MOBILE_USER_NAV_ITEMS} from './constants'

export default function MobileNavbarLinks() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      {MOBILE_USER_NAV_ITEMS.map((item) => (
        <Link
          key={item.title}
          href={item.path}
          className='text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
          prefetch={false}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}
