'use client'
import {useCart} from '@/hooks/use-cart'
import {formatCurrency} from '@/lib/formatters'
import {Button} from '@/ui/button'
import {Separator} from '@/ui/separator'
import {Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '@/ui/sheet'
import {Toggle} from '@/ui/toggle'
import {MinusIcon, PlusIcon, ShoppingBag, ShoppingCartIcon, X} from 'lucide-react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import Empty from '@/assets/images/empty.svg'

export default function CartIcon() {
  const router = useRouter()
  const {items, totalQuantity, updateQuantity, removeItem, totalAmount} = useCart()
  const isCartEmpty = items.length === 0

  return (
    <Sheet>
      <SheetTrigger asChild className='flex items-center justify-center hover:cursor-pointer'>
        <Toggle asChild className='size-5 rounded-full md:size-9'>
          <div className='relative'>
            <div className='absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary p-2.5 text-sm font-semibold text-white'>
              <span>{totalQuantity}</span>
            </div>

            <ShoppingCartIcon />
          </div>
        </Toggle>
      </SheetTrigger>
      <SheetContent className='w-[320px] sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle>
            <div className='flex items-center gap-3'>
              <ShoppingBag /> Mini cart
            </div>
          </SheetTitle>
          <SheetDescription className='text-sm font-bold text-primary'>{totalQuantity} items</SheetDescription>
        </SheetHeader>
        {isCartEmpty ? (
          <Empty />
        ) : (
          <div className='my-6 max-h-[90vh] overflow-y-auto'>
            <div>
              <ul>
                {items.map((product, index) => (
                  <li key={index}>
                    <div className='flex justify-evenly gap-4 pb-[10px] pt-2'>
                      <div className='relative aspect-square h-[75px] flex-shrink-0 overflow-hidden'>
                        <Image
                          src={product.image ?? ''}
                          alt='prod img'
                          priority
                          fill
                          sizes='30'
                          className='object-cover'
                        />
                      </div>
                      <div className='flex max-w-[200px] flex-col justify-between'>
                        <p>{product.name}</p>
                        <div className='flex items-center justify-center gap-8'>
                          <div className='flex items-center'>
                            <Button
                              type='button'
                              className='rounded-full text-white hover:bg-blue-800'
                              onClick={async () => {
                                const newQuantity = product.quantity - 1
                                if (newQuantity <= 0) {
                                  await removeItem(product.productId, product.variantId ?? null)
                                } else {
                                  await updateQuantity(product.productId, product.variantId ?? null, newQuantity)
                                }
                              }}
                            >
                              <MinusIcon />
                            </Button>
                            <div className='flex w-[25px] justify-center'>{product.quantity}</div>
                            <Button
                              type='button'
                              className='rounded-full text-white hover:bg-blue-800'
                              onClick={async () => {
                                await updateQuantity(product.productId, product.variantId ?? null, product.quantity + 1)
                              }}
                            >
                              <PlusIcon />
                            </Button>
                          </div>
                          <span>{formatCurrency(product.price * product.quantity)}</span>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <Button
                          size={'icon'}
                          variant='outline'
                          onClick={() => removeItem(product.productId, product.variantId ?? null)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </li>
                ))}
              </ul>
            </div>
            <div className='my-5 flex items-center justify-between'>
              <p className='text-sm text-primary'>Subtotal:</p>
              <p className='text-2xl font-bold'>{formatCurrency(totalAmount)}</p>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-primary'>Shipping:</p>
              <p className='text-[.6rem]'>Taxes and shipping fee will be calculated at checkout</p>
            </div>
            <div className='my-20 flex flex-col gap-3'>
              <SheetClose asChild>
                <Button onClick={() => router.push('/cart')}>View cart</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant='outline'>Continue shopping</Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
