import PurchaseSuccessClearCartPage from '@/features/cart/purchase-success-clear-cart'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Stripe from 'stripe'
type Props = {
  searchParams: Promise<{payment_intent: string}>
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function PurchaseSuccessPage({searchParams}: Props) {
  const {payment_intent} = await searchParams

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
  if (paymentIntent.metadata.cartId == null) return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  return (
    <div className='mx-auto w-full max-w-5xl space-y-8'>
      <h1 className='text-4xl font-bold'>{isSuccess ? 'Success!' : 'Error!'}</h1>
      <div className='flex items-center gap-4'>
        <div>
          <Link href={'#'} className='mt-4'>
            View order
          </Link>
        </div>
        <div>
          <Link href={'/'} className='mt-4'>
            continue shopping{' '}
          </Link>
        </div>
      </div>
      <PurchaseSuccessClearCartPage />
    </div>
  )
}
