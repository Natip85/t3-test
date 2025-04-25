'use client'
import {useCart} from '@/hooks/use-cart'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '@/ui/sheet'
import {Toggle} from '@/ui/toggle'
import {ShoppingCartIcon} from 'lucide-react'

export default function CartIcon() {
  const {totalQuantity} = useCart()
  return (
    <Sheet>
      <SheetTrigger asChild className='flex items-center justify-center hover:cursor-pointer'>
        <Toggle asChild className='size-5 rounded-full md:size-9'>
          <div className='relative'>
            <div className='absolute right-0 top-0'>{totalQuantity}</div>
            <ShoppingCartIcon />
          </div>
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
  )
}
