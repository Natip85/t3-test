import {db} from '@/server/db'
import {eq} from 'drizzle-orm'
import {cart} from '@/server/db/schema'
import {type NextRequest, NextResponse} from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature')!,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const cartId = charge.metadata.cartId

    console.log('charge-suceed>>>>', charge)

    if (!cartId) {
      console.error('No cartId found in charge metadata.')
      return new NextResponse('Missing cartId', {status: 400})
    }

    await db.delete(cart).where(eq(cart.id, Number(cartId)))
  }

  return new NextResponse()
}
