'use client'
import {useCart} from '@/hooks/use-cart'
import {formatCurrency} from '@/lib/formatters'
import {Button} from '@/ui/button'
import {Separator} from '@/ui/separator'
import {MinusIcon, PlusIcon, X} from 'lucide-react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import Empty from '@/assets/images/empty.svg'
import {useUser} from '@/hooks/use-user'
import {api} from '@/trpc/react'

export default function CartReview() {
  const {isAuthenticated, user} = useUser()
  const router = useRouter()
  const {totalAmount, removeItem, updateQuantity, items, totalQuantity} = useCart()
  const {mutateAsync: createCart, isPending: isLoading} = api.carts.createCart.useMutation()

  if (items.length === 0) {
    return (
      <div className='flex min-h-screen flex-col'>
        <h2 className='text-xl font-semibold'>Cart ({totalQuantity} items)</h2>
        <div className='mx-auto flex w-fit flex-1 flex-col items-center justify-center gap-5 p-4'>
          <div className='size-96'>
            <Empty />
          </div>
          {!isAuthenticated && (
            <>
              <Button onClick={() => router.push(`/auth/login?callbackUrl=/cart`)} className='w-full rounded-full'>
                Sign in
              </Button>
              <Separator />
            </>
          )}

          <p className='text-2xl font-semibold'>It&apos;s time to start shopping!</p>
          <Button variant={'outline'} onClick={() => router.push('/')} className='w-full rounded-full'>
            Home page
          </Button>
        </div>
      </div>
    )
  }
  const handleCheckout = async () => {
    const res = await createCart({items, totalAmount, totalQuantity, userId: user.id})
    router.push(`/checkout?cartId=${res}`)
  }
  return (
    <div className='mx-auto flex flex-col gap-10 md:flex-row'>
      <div className='h-fit flex-1 rounded-md border p-2 shadow-lg'>
        <h2 className='text-2xl font-semibold'>{totalQuantity} items</h2>
        <ul>
          {items.map((product, index) => (
            <li key={index}>
              <div className='flex justify-evenly gap-4 pb-[10px] pt-2'>
                <div className='relative aspect-square h-[75px] flex-shrink-0 overflow-hidden'>
                  <Image src={product.image ?? ''} alt='prod img' priority fill sizes='30' className='object-cover' />
                </div>
                <div className='flex max-w-[200px] flex-col justify-between'>
                  <p>{product.name}</p>
                  <div className='flex items-center justify-center gap-8'>
                    <div className='flex items-center'>
                      <Button
                        type='button'
                        className='rounded-full text-white hover:bg-blue-800'
                        onClick={() => {
                          const newQuantity = product.quantity - 1
                          if (newQuantity <= 0) {
                            removeItem(product.productId, product.variantId ?? null)
                          } else {
                            updateQuantity(product.productId, product.variantId ?? null, newQuantity)
                          }
                        }}
                      >
                        <MinusIcon />
                      </Button>
                      <div className='flex w-[25px] justify-center'>{product.quantity}</div>
                      <Button
                        type='button'
                        className='rounded-full text-white hover:bg-blue-800'
                        onClick={() => {
                          updateQuantity(product.productId, product.variantId ?? null, product.quantity + 1)
                        }}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    <span>{formatCurrency(product.price * product.quantity)}</span>
                  </div>
                </div>
                <div className='b flex items-center'>
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
      <div className='h-fit rounded-md border p-2 shadow-lg md:w-1/3'>
        <div className='my-5 flex items-center justify-between'>
          <p className='text-sm text-primary'>Subtotal: ({totalQuantity} items)</p>
          <p className='text-2xl font-bold'>{formatCurrency(totalAmount)}</p>
        </div>
        <Separator />
        <div className='mt-3 flex items-center justify-between'>
          <p className='text-sm text-primary'>Shipping:</p>
          <p className='text-[.6rem] text-green-500'>FREE</p>
        </div>
        <div className='mt-5 flex items-center justify-between'>
          <p className='text-sm text-primary'>Taxes:</p>
          <p className='text-[.6rem]'>Calculated at checkout</p>
        </div>
        <div className='my-5 flex items-center justify-between'>
          <p className='text-sm text-primary'>Estimated total:</p>
          <p className='text-2xl font-bold'>{formatCurrency(totalAmount)}</p>
        </div>
        <Separator />
        <div className='my-20 flex flex-col gap-3'>
          <Button disabled={isLoading} className='rounded-full' onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
