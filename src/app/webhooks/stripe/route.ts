import {env} from '@/env'
import {db} from '@/server/db'
import {eq} from 'drizzle-orm'
import {cart, order, orderItems, users} from '@/server/db/schema'
import {type NextRequest, NextResponse} from 'next/server'
import Stripe from 'stripe'
import {Resend} from 'resend'
import PurchaseReceiptEmail from '@/features/email/purchase-receipt'
const stripe = new Stripe(env.STRIPE_SECRET_KEY)
const resend = new Resend(env.AUTH_RESEND_KEY)

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature')!,
    env.STRIPE_WEBHOOK_SECRET
  )

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const cartId = paymentIntent.metadata.cartId
    const userId = paymentIntent.metadata.userId
    const paymentIntentId = paymentIntent.id

    if (!userId) {
      return new NextResponse('Missing userId', {status: 400})
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!currentUser) {
      return new NextResponse('Cannot find user', {status: 400})
    }

    if (!cartId) {
      console.error('No cartId found in charge metadata.')
      return new NextResponse('Missing cartId', {status: 400})
    }

    const existingCart = await db.query.cart.findFirst({
      where: (cart) => eq(cart.id, Number(cartId)),
      with: {cartItems: true},
    })

    if (!existingCart) {
      console.error('Cart not found')
      return new NextResponse('Cart not found', {status: 404})
    }

    const [newOrder] = await db
      .insert(order)
      .values({
        status: 'PAID',
        userId: userId,
        totalAmount: existingCart.totalAmount,
        paymentIntentId: paymentIntentId,
      })
      .returning()

    if (!newOrder) {
      return new NextResponse('Order id not found', {status: 404})
    }

    const orderItemsToCreate = existingCart.cartItems.map((item) => ({
      orderId: newOrder?.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
      cartId: item.cartId,
      name: item.name,
      image: item.image,
    }))

    const newOrderItems = await db.insert(orderItems).values(orderItemsToCreate).returning()

    await db.delete(cart).where(eq(cart.id, Number(cartId)))

    await resend.emails.send({
      from: `Support <${env.EMAIL_FROM}>`,
      to: currentUser.email,
      subject: 'Order Confirmation',
      react: PurchaseReceiptEmail({products: newOrderItems, order: newOrder}),
    })
  }
  return new NextResponse()
}
