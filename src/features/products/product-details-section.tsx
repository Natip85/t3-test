'use client'

import {Rating} from '@/ui/rating'
import {useState} from 'react'
import {type VariantSelect, type Product} from './product-types'
import Link from 'next/link'
import {Separator} from '@/ui/separator'
import {Button} from '@/ui/button'
import Image from 'next/image'
import {useCart} from '@/hooks/use-cart'
import {MinusIcon, PlusIcon} from 'lucide-react'
import {formatCurrency} from '@/lib/formatters'
import {cn} from '@/lib/utils'

interface Props {
  product?: Product
}

export default function ProductDetailsSection({product}: Props) {
  const [rating, setRating] = useState<number>(1)
  const [selectedVariantAsset, setSelectedVariantAsset] = useState<{
    variant: VariantSelect
    imageUrl: string
  } | null>(null)
  const {items, addItem, updateQuantity} = useCart()

  if (!product) return null

  const hasVariants = product.variants.length > 0
  const currentItem = items.find(
    (item) => item.productId === product.id && (!hasVariants || item.variantId === selectedVariantAsset?.variant.id)
  )
  const quantity = currentItem?.quantity ?? 0
  const isInCart = !!currentItem

  return (
    <div className='flex min-w-0 flex-1 flex-col gap-3 md:flex-row'>
      <div className='flex-1'>
        <div className='p-2'>
          <h2 className='text-2xl font-semibold md:text-4xl'>{product.name}</h2>
          <div className='mb-3 flex items-center gap-2'>
            <Rating rating={rating} iconCount={5} onInteract={setRating} className='size-3 text-yellow-300' />
            <span className='text-xs text-muted-foreground'>(55)</span> |{' '}
            <Link href={'#'} className='text-xs underline hover:text-primary hover:no-underline'>
              1,555 ratings
            </Link>
          </div>
        </div>
        <Separator />
        {hasVariants && (
          <>
            <span className='font-semibold'>Variants:</span>
            <div className='flex flex-wrap items-center justify-center gap-3 p-2'>
              {product.variants.map((variant) =>
                variant.assets.map((asset) => {
                  const thumbUrl = asset.variantAsset.fileInfo?.url ?? ''
                  return (
                    <div key={asset.id} className='flex flex-col items-center rounded-full'>
                      <div
                        className={cn(
                          'relative aspect-square size-12 cursor-pointer rounded-full border transition-all',
                          selectedVariantAsset?.variant.id === variant.id
                            ? 'border-primary ring-2 ring-primary'
                            : 'border-gray-300'
                        )}
                        onClick={() => {
                          setSelectedVariantAsset({
                            variant,
                            imageUrl: thumbUrl,
                          })
                        }}
                      >
                        <Image src={thumbUrl} alt='prod img' fill className='rounded-full object-cover' />
                      </div>
                      <span className='text-xs'>{variant.value.map((val) => val.value?.value).join(' / ')}</span>
                    </div>
                  )
                })
              )}
            </div>
            {!selectedVariantAsset?.variant && (
              <p className='text-sm text-red-500'>Please select a variant before adding to cart.</p>
            )}
            <Separator />
          </>
        )}
        <div className='p-2'>
          <h2 className='font-semibold'>About this item</h2>
          <ExpandableText text={product.description ?? ''} maxLength={200} />
        </div>
      </div>

      <div className='flex h-fit flex-1 flex-col gap-10 rounded-lg border p-3 shadow-md'>
        <div className='text-2xl font-semibold text-green-400 md:text-3xl'>
          {formatCurrency(
            selectedVariantAsset?.variant ? parseInt(selectedVariantAsset?.variant.price) : product.price || 0
          )}
        </div>
        <div className='flex w-full flex-col gap-2'>
          {isInCart ? (
            <div className='flex w-full items-center justify-between gap-3 rounded-full bg-primary p-1'>
              <Button
                type='button'
                className='rounded-full text-white hover:bg-blue-800'
                onClick={() => {
                  if (quantity > 1) {
                    updateQuantity(product.id, selectedVariantAsset?.variant.id ?? null, quantity - 1)
                  } else {
                    updateQuantity(product.id, selectedVariantAsset?.variant.id ?? null, 0)
                  }
                }}
              >
                <MinusIcon />
              </Button>
              <span className='text-white'>{quantity} added</span>
              <Button
                type='button'
                className='rounded-full text-white hover:bg-blue-800'
                onClick={() => {
                  updateQuantity(product.id, selectedVariantAsset?.variant.id ?? null, quantity + 1)
                }}
              >
                <PlusIcon />
              </Button>
            </div>
          ) : (
            <Button
              className='w-full rounded-full bg-primary text-white'
              onClick={() => {
                if (hasVariants && !selectedVariantAsset?.variant) return
                addItem({
                  productId: product.id,
                  variantId: selectedVariantAsset?.variant.id ?? null,
                  price: selectedVariantAsset ? parseInt(selectedVariantAsset.variant.price) : parseInt(product.price),
                  name: product.name,
                  quantity: 1,
                  image: selectedVariantAsset?.imageUrl ?? product.assets[0]?.asset.fileInfo?.url,
                })
              }}
            >
              {product.variants.length > 0 ? (
                <> {!selectedVariantAsset ? <span>Select a variant to add to cart</span> : <span>Add to Cart</span>}</>
              ) : (
                <>
                  <span>Add to Cart</span>
                </>
              )}
            </Button>
          )}
        </div>
        <Separator />
      </div>
    </div>
  )
}

export function ExpandableText({text, maxLength}: {text: string; maxLength: number}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = text.length > maxLength

  return (
    <div>
      <p className='text-muted-foreground'>
        {shouldTruncate && !isExpanded ? `${text.substring(0, maxLength)}...` : text}
      </p>
      {shouldTruncate && (
        <Button
          type='button'
          variant='link'
          className='mt-1 h-auto p-0 text-primary'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  )
}
