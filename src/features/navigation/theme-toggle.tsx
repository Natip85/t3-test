'use client'

import {useTheme} from 'next-themes'
import {useEffect, useState} from 'react'
import {Toggle} from '@/ui/toggle'
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}
const MoonIcon: React.FC<IconProps> = (props) => {
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
      <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
    </svg>
  )
}
const SunIcon: React.FC<IconProps> = (props) => {
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
      <circle cx='12' cy='12' r='5' />
      <path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' />
    </svg>
  )
}
export function ThemeToggle() {
  const {setTheme, resolvedTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <Toggle
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className='font-button flex items-center gap-2 rounded-full text-xl'
    >
      <>
        {resolvedTheme === 'dark' ? (
          <SunIcon className='size-4 text-primary' />
        ) : (
          <MoonIcon className='size-4 text-gray-800' />
        )}
        <span className='sr-only'>Toggle theme</span>
        {/* <span>Toggle theme</span> */}
      </>
    </Toggle>
  )
}
