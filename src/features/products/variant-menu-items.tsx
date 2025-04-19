import Link from 'next/link'
import {type Variants} from './product-types'
import {ImageIcon} from 'lucide-react'
import {cn} from '@/lib/utils'
import Image from 'next/image'

interface Props {
  variants: Variants
  variantId: string
}
export default function VariantMenuItems({variants, variantId}: Props) {
  const firstVarImg = variants.flatMap((item) => item.assets)
  return (
    <div className='flex flex-col gap-2 rounded-md border p-2'>
      <div className='flex items-center gap-3'>
        <ImageIcon className='size-14' />
        <div className='flex flex-col gap-1'>
          <span className='font-semibold'>{variants[0]?.product?.name}</span>
          <span className='text-sm text-muted-foreground'>{variants.length} variants</span>
        </div>
      </div>
      {variants.map((item) => (
        <Link key={item.id} href={`/admin/products/${item.productId}/variant/${item.id}`}>
          <div
            className={cn('flex items-center gap-3 rounded-lg border p-2 text-sm hover:bg-secondary', {
              'bg-secondary': item.id === parseInt(variantId),
            })}
          >
            <div>
              {item.assets[0]?.asset.fileInfo?.url ? (
                <div className='relative aspect-square size-8'>
                  <Image
                    src={item.assets[0]?.asset.fileInfo?.url}
                    fill
                    alt='variant img'
                    className='h-10 w-10 rounded-md object-cover'
                  />
                </div>
              ) : (
                <ImageIcon />
              )}
            </div>
            {item.value.map((val) => {
              return (
                <div key={val.id} className=''>
                  {val.value?.value}
                </div>
              )
            })}
          </div>
        </Link>
      ))}
    </div>
  )
}
