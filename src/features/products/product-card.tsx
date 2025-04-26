'use client'

import {Card, CardContent} from '@/ui/card'
import {type Product} from './product-types'
import {Button} from '@/ui/button'
import {HeartIcon, PlusIcon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'
import {Rating} from '@/ui/rating'

interface Props {
  product?: Product
}
export default function ProductCard({product}: Props) {
  const [rating, setRating] = useState<number>(1)
  const defaultImage = product?.assets[0]?.asset.fileInfo?.url ?? ''
  const [mainImage, setMainImage] = useState<string>(defaultImage)
  if (!product) return null
  const description = product.description ?? ''
  const shouldTruncate = description.length > 50

  return (
    <Card className='relative flex min-w-[180px] max-w-[300px] flex-col gap-4 overflow-hidden rounded-none border-none shadow-none'>
      <Button variant='ghost' size='icon' className='absolute right-1 top-1 rounded-full'>
        <HeartIcon className='size-4 text-primary' />
      </Button>

      {/* Main image */}
      <Link href={`/product/${product.id}`}>
        <Image className='aspect-square w-full' src={mainImage} width={300} height={500} alt='Product Image' />
      </Link>

      <CardContent className='space-y-4 p-0'>
        {/* Variant image thumbnails */}
        <div className='flex items-center justify-center gap-3'>
          {product.variants.map((variant) =>
            variant.assets.map((asset) => {
              const thumbUrl = asset.variantAsset.fileInfo?.url ?? ''
              return (
                <div key={asset.id} className='rounded-full'>
                  <div
                    className='relative aspect-square size-7 cursor-pointer rounded-full border'
                    onClick={() => setMainImage(thumbUrl)}
                  >
                    <Image src={thumbUrl} alt='prod img' fill className='rounded-full object-cover' />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <Button
          variant='ghost'
          className='w-fit rounded-full border bg-primary text-white hover:bg-primary/90 hover:text-white'
        >
          <PlusIcon className='size-4' /> Add
        </Button>

        <Link href={`/product/${product.id}`}>
          <div className='mt-4 flex flex-col justify-between gap-1'>
            <p className='text-2xl font-semibold'>{product?.price}</p>
            <div>{shouldTruncate ? `${description.substring(0, 50)}...` : description}</div>
          </div>
        </Link>

        <Rating rating={rating} iconCount={5} onInteract={setRating} className='size-3 text-yellow-300' />
      </CardContent>
    </Card>
  )
}
