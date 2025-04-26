'use client'

import {useCart} from '@/hooks/use-cart'
import {formatCurrency} from '@/lib/formatters'
import {Button} from '@/ui/button'
import React from 'react'
import {type Product} from './product-types'
import {MinusIcon, PlusIcon} from 'lucide-react'

type Props = {
  product?: Product
}

export default function AddProductToCartSection({product}: Props) {
  const {items, addItem, clearCart} = useCart()
  if (!product) return null

  const isInCart = items.some((item) => item.productId === product.id)

  return (
    <div className='flex flex-1 flex-col gap-10'>
      <div className='text-2xl font-semibold text-green-400 md:text-4xl'>{formatCurrency(product.price || 0)}</div>

      <div className='flex w-full flex-col gap-2'>
        {isInCart ? (
          <div className='flex w-full items-center justify-between gap-3 rounded-full bg-primary'>
            <Button
              type='button'
              className='rounded-full text-white'
              onClick={() => {
                console.log('Minus clicked')
                // handle decrease
              }}
            >
              <MinusIcon />
            </Button>
            <Button
              type='button'
              className='rounded-full text-white'
              onClick={() => {
                console.log('Plus clicked')
                // handle increase
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <Button
            className='w-full rounded-full bg-primary text-white'
            onClick={() =>
              addItem({
                productId: product.id,
                variantId: 33,
                price: parseInt(product.price),
                name: product.name,
                quantity: 1,
              })
            }
          >
            <span>Add to Cart</span>
          </Button>
        )}
      </div>

      <Button className='w-full rounded-full bg-destructive text-white' onClick={() => clearCart()}>
        Clear Cart
      </Button>
    </div>
  )
}
