import PurchaseSuccessClearCartPage from '@/features/cart/purchase-success-clear-cart'
import {formatCurrency} from '@/lib/formatters'
import {api} from '@/trpc/server'
import {buttonVariants} from '@/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Stripe from 'stripe'
type Props = {
  searchParams: Promise<{payment_intent: string}>
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function PurchaseSuccessPage({searchParams}: Props) {
  const {payment_intent} = await searchParams
  console.log('success payment_intent>>>>', payment_intent)

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
  console.log('success retrieved paymentIntent>>>>', paymentIntent.metadata)

  if (paymentIntent.metadata.cartId == null) return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  const order = await api.orders.getByIntentId(payment_intent)
  console.log('success order>>>>', order)

  if (!order) return notFound()

  return (
    <div className='mx-auto w-full max-w-5xl space-y-8 p-6'>
      <div className='space-y-4 text-center'>
        <h1 className='text-5xl font-bold text-green-600'>
          {isSuccess ? 'Thank you for your purchase!' : 'Payment Failed'}
        </h1>
        <p className='text-lg'>
          {isSuccess
            ? 'Your order has been successfully placed. A confirmation email will be sent shortly.'
            : 'Something went wrong with your payment. Please try again.'}
        </p>
      </div>

      {isSuccess && (
        <div className='space-y-6 rounded-lg border p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-semibold'>Order Summary</h2>
              <p>Order ID: {order.id}</p>
              <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className='text-right'>
              <p className='text-lg font-medium'>Total: {formatCurrency(order.totalAmount)}</p>
            </div>
          </div>

          <div className='divide-y'>
            {order.items.map((item) => (
              <div key={item.id} className='flex items-center gap-4 py-4'>
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={64} height={64} className='rounded-md object-cover' />
                ) : (
                  <div className='h-16 w-16 rounded-md' />
                )}
                <div className='flex-1'>
                  <p className='font-medium'>{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-end gap-4 pt-6'>
            <Link href={`/profile/history/${order.id}`} className={buttonVariants()}>
              View Order Details
            </Link>
            <Link href='/' className={buttonVariants({variant: 'outline'})}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      <PurchaseSuccessClearCartPage />
    </div>
  )
}
