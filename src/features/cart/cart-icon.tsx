'use client'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '@/ui/sheet'
import {Toggle} from '@/ui/toggle'
import {ShoppingCartIcon} from 'lucide-react'

export default function CartIcon() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild className='flex items-center justify-center'>
          <Toggle className='rounded-full'>
            <ShoppingCartIcon className='size-5' />
          </Toggle>
        </SheetTrigger>
        <SheetContent className='w-[320px] sm:w-[540px]'>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}
