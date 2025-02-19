'use client'
export default function Footer() {
  return (
    <footer className='z-50 flex-grow-0 border-t border-accent bg-black'>
      <div className='mx-auto flex max-w-7xl items-center justify-center p-4'>
        <p className='text-sm text-white'>&copy; {new Date().getFullYear()} - T3 APP</p>
      </div>
    </footer>
  )
}
