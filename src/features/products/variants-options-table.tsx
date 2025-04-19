'use client'

import Link from 'next/link'
import type {Product} from './product-types'
import {ImageIcon} from 'lucide-react'

interface Props {
  product?: Product
}

export default function VariantOptionsTable({product}: Props) {
  console.log('Product:', product?.variants)
  const data = product?.variants.map((variant) => variant)

  return (
    <div className='flex flex-col gap-2 rounded-md border p-2'>
      {data?.map((item) => (
        <Link key={item.id} href={`/admin/products/${product?.id}/variant/${item.id}`}>
          <div className='flex items-center gap-3 rounded-lg border p-2 text-sm hover:bg-stone-800'>
            <div>
              <ImageIcon />
            </div>
            {item.value.map((val) => {
              return <div key={val.id}>{val.value?.value}</div>
            })}
          </div>
        </Link>
      ))}
    </div>
  )
}
