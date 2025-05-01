import CheckoutForm from '@/features/cart/checkout-form'
import {auth} from '@/server/auth'
import {api} from '@/trpc/server'
import Stripe from 'stripe'
import {env} from '@/env'

type Props = {
  searchParams: Promise<{cartId: string}>
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export default async function CheckoutPage({searchParams}: Props) {
  const user = await auth()
  if (!user?.user.id) {
    return <div>No user id found</div>
  }
  const {cartId} = await searchParams
  const cart = await api.carts.getById(Number(cartId))
  if (!cart) {
    return <div>Cart not found</div>
  }
  console.log('rerfefere')

  const paymentIntent = await stripe.paymentIntents.create({
    amount: cart.totalAmount,
    currency: 'USD',
    metadata: {cartId, userId: user.user.id},
  })

  if (paymentIntent.client_secret == null) {
    throw Error('Stripe failed to create payment intent')
  }

  return (
    <div className='flex-1 p-2 md:p-5'>
      <CheckoutForm cart={cart} clientSecret={paymentIntent.client_secret} />
    </div>
  )
}
