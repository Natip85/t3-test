'use client'

import {useCart} from '@/hooks/use-cart'
import {formatCurrency} from '@/lib/formatters'
import {Button} from '@/ui/button'
import React from 'react'
import {type Product} from './product-types'
import {CheckCircle} from 'lucide-react'

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

      <div className='flex flex-col gap-2'>
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
          disabled={isInCart}
        >
          {isInCart ? (
            <div className='flex items-center gap-3'>
              <CheckCircle className='text-green-400' /> <span>Added to Cart</span>
            </div>
          ) : (
            <span>Add to Cart</span>
          )}
        </Button>

        <Button className='w-full rounded-full bg-destructive text-white' onClick={() => clearCart()}>
          Clear Cart
        </Button>
      </div>
    </div>
  )
}
