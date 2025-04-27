'use client'

import Image from 'next/image'
import {type Product} from './product-types'
import {useState} from 'react'

interface ProductImageProps {
  product?: Product
}
const ProductImage = ({product}: ProductImageProps) => {
  const defaultImage = product?.assets[0]?.asset.fileInfo?.url ?? ''
  const [selectedImage, setSelectedImage] = useState<string>(defaultImage)

  return (
    <div className='flex max-w-full flex-1 flex-col gap-2 sm:flex-row'>
      {/* Thumbnail section */}
      <div className='mx-auto mt-2 flex h-[100px] flex-row gap-2 overflow-auto sm:mt-0 sm:h-[500px] sm:w-[120px] sm:min-w-[100px] sm:flex-col'>
        {product?.variants.map((variant) =>
          variant.assets.map((asset) => {
            const thumbUrl = asset.variantAsset.fileInfo?.url ?? ''
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedImage(thumbUrl)}
                className={`relative aspect-square w-[80px] flex-shrink-0 rounded-md border transition-all duration-200 sm:w-full ${
                  selectedImage === thumbUrl ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image src={thumbUrl} alt='prod img' fill className='object-contain' />
              </div>
            )
          })
        )}
      </div>
      {/* Main image */}
      <div className='aspect-square w-full sm:w-[500px]'>
        <Image
          src={selectedImage}
          alt='Product Image'
          className='h-full w-full rounded-md object-contain'
          width={500}
          height={500}
        />
      </div>
    </div>
  )
}

export default ProductImage
