'use client'
import {Rating} from '@/ui/rating'
import {useState} from 'react'
import {type Product} from './product-types'
import Link from 'next/link'
import {Separator} from '@/ui/separator'
import {Button} from '@/ui/button'
import Image from 'next/image'
interface Props {
  product?: Product
}
export default function ProductDetailsSection({product}: Props) {
  const [rating, setRating] = useState<number>(1)

  return (
    <div className='min-w-0 flex-1'>
      <div className='p-2'>
        <h2 className='text-2xl font-semibold md:text-4xl'>{product?.name}</h2>
        <div className='mb-3 flex items-center gap-2'>
          <Rating rating={rating} iconCount={5} onInteract={setRating} className='size-3 text-yellow-300' />{' '}
          <span className='text-xs text-muted-foreground'>(55)</span> |{' '}
          <Link href={'#'} className='text-xs underline hover:text-primary hover:no-underline'>
            1,555 ratings
          </Link>
        </div>
      </div>
      <Separator />
      <span className='font-semibold'>Variants:</span>
      <div className='flex flex-wrap items-center justify-center gap-3 p-2'>
        {product?.variants.map((variant) =>
          variant.assets.map((asset) => {
            const thumbUrl = asset.variantAsset.fileInfo?.url ?? ''
            return (
              <div key={asset.id} className='flex flex-col items-center rounded-full'>
                <div
                  className='relative aspect-square size-12 cursor-pointer rounded-full border'
                  // onClick={() => setMainImage(thumbUrl)}
                >
                  <Image src={thumbUrl} alt='prod img' fill className='rounded-full object-cover' />
                </div>
                <span className='text-xs'>{variant.value.map((val) => val.value?.value).join(' / ')}</span>
              </div>
            )
          })
        )}
      </div>
      <Separator />
      <div className='p-2'>
        <h2 className='font-semibold'>About this item</h2>
        <ExpandableText text={product?.description ?? ''} maxLength={200} />
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
