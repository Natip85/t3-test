'use client'
import {type Cart} from './cart-types'
import {loadStripe} from '@stripe/stripe-js'
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle} from '@/ui/card'
import {Button} from '@/ui/button'
import {formatCurrency} from '@/lib/formatters'
import {type FormEvent, useState} from 'react'
import {notFound} from 'next/navigation'
import {env} from '@/env'
import {Loader2} from 'lucide-react'
import Image from 'next/image'

interface Props {
  cart?: Cart
  clientSecret: string
}

const stripePublishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Stripe publishable key is not defined')
}

const stripePromise = loadStripe(stripePublishableKey)
export default function CheckoutForm({cart, clientSecret}: Props) {
  if (!cart) return notFound()

  return (
    <div className='mx-auto w-full max-w-5xl space-y-8'>
      {cart.cartItems.map((item) => (
        <div key={item.id} className='flex items-center gap-4'>
          <div className='relative aspect-video w-1/4 flex-shrink-0'>
            <Image src={item.image ?? ''} fill alt={item.name} className='object-cover' />
          </div>
          <div>
            <div className='flex items-baseline gap-4 text-lg'>
              <div>{formatCurrency(item.price)}</div>
            </div>
            <h1 className='text-2xl font-bold'>{item.name}</h1>
            <div className='line-clamp-3 text-muted-foreground'>description here</div>
          </div>
        </div>
      ))}

      <Elements options={{clientSecret}} stripe={stripePromise}>
        <Form priceInCents={cart.totalAmount} />
      </Elements>
    </div>
  )
}

function Form({priceInCents}: {priceInCents: number}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null) return

    setIsLoading(true)

    await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({error}) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className='text-destructive'>{errorMessage && <div>{errorMessage}</div>}</CardDescription>
        </CardHeader>
        <CardContent>
          {elements ? (
            <PaymentElement />
          ) : (
            <div>
              <Loader2 className='animate-spin' /> Loading...
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className='w-full' size='lg' disabled={stripe == null || elements == null || isLoading}>
            {isLoading ? 'Purchasing...' : `Purchase - ${formatCurrency(priceInCents)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
