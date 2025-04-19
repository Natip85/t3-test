import Link from 'next/link'
import {type Variants} from './product-types'
import {ImageIcon} from 'lucide-react'

interface Props {
  variants: Variants
}
export default function VariantMenuItems({variants}: Props) {
  console.log('variants>>>: ', variants)
  return (
    <div className='flex flex-col gap-2 rounded-md border p-2'>
      <div className='flex items-center gap-3'>
        <ImageIcon className='size-14' />
        <div className='flex flex-col gap-1'>
          <span>{variants[0]?.product?.name}</span>
          <span className='text-sm text-muted-foreground'>{variants.length} variants</span>
        </div>
      </div>
      {variants.map((item) => (
        <Link key={item.id} href={`/admin/products/${item.productId}/variant/${item.id}`}>
          <div className='flex items-center gap-3 rounded-lg border p-2 text-sm hover:bg-stone-800'>
            <div>
              <ImageIcon />
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
