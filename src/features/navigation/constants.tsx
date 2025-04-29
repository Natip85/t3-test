import {ArchiveIcon, UserCircle2} from 'lucide-react'
export type NavItem = {
  title: string
  path: string
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  submenu?: boolean
  submenuItems?: NavItem[]
}

export const NO_NAV_ITEMS: NavItem[] = []

export const USER_NAV_ITEMS: NavItem[] = [
  {
    title: 'T3 testing 1',
    path: '/t3-testing1',
  },
  {
    title: 'T3 tetsing 2',
    path: '/t3-testing2',
  },
  {
    title: 'T3 tetsing 3',
    path: '/t3-testing3',
  },
  // {
  //   title: 'MORE',
  //   path: '/more',
  //   submenu: true,
  //   submenuItems: [
  //     {title: 'MORE STUFF', path: '/fdfdfd'},
  //     {title: 'ANOTHER', path: '/gfgfhfgf'},
  //   ],
  // },
]
export const MOBILE_USER_NAV_ITEMS: NavItem[] = [
  {
    title: 'T3 testing 1',
    path: '/t3-testing1',
  },
  {
    title: 'T3 testing 2',
    path: '/t3-testing2',
  },
]

export const PROFILE_MENU_LINKS = [
  {
    icon: <UserCircle2 />,
    iconActive: <UserCircle2 />,
    route: '/profile/details',
    label: 'Account Details',
  },
  {
    icon: <ArchiveIcon />,
    iconActive: <ArchiveIcon />,
    route: '/profile/history',
    label: 'Order History',
  },
]
