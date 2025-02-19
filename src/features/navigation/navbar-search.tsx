import {Button} from '@/ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from '@/ui/dropdown-menu'
import {Input} from '@/ui/input'
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}
const SearchIcon: React.FC<IconProps> = (props) => {
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
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  )
}

export default function NavbarSearch() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <SearchIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
          <span className='sr-only'>Search</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[300px] p-4'>
        <div className='relative'>
          <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
          <Input type='search' placeholder='Search...' className='w-full pl-8' />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
