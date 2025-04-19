'use client'

import type {Product, Variant} from './product-types'
import {ImageIcon} from 'lucide-react'
import {formatCurrency} from '@/lib/formatters'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/ui/table'
import Image from 'next/image'

interface Props {
  product?: Product
  variants?: Variant[]
}

export default function VariantOptionsTable({product, variants}: Props) {
  const data = product?.variants ?? []
  if (!data.length) return null
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-10' />
            <TableHead>Options</TableHead>
            <TableHead className='text-right'>Price</TableHead>
            <TableHead className='text-right'>Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants?.map((variant) => (
            <TableRow key={variant.id} className='cursor-pointer hover:bg-muted'>
              <TableCell>
                <a href={`/admin/products/${product?.id}/variant/${variant.id}`}>
                  <div>
                    {variant.assets[0]?.asset.fileInfo?.url ? (
                      <div className='relative aspect-square size-8'>
                        <Image
                          src={variant.assets[0]?.asset.fileInfo?.url}
                          fill
                          alt='variant img'
                          className='h-10 w-10 rounded-md object-cover'
                        />
                      </div>
                    ) : (
                      <ImageIcon />
                    )}
                  </div>
                </a>
              </TableCell>
              <TableCell className='flex flex-wrap gap-1'>
                <a href={`/admin/products/${product?.id}/variant/${variant.id}`} className='w-full'>
                  {variant.value.map((val) => (
                    <span key={val.id} className='px-2 py-0.5 text-xs'>
                      {val.value?.value}
                    </span>
                  ))}
                </a>
              </TableCell>

              <TableCell className='text-right'>{formatCurrency(variant.price)}</TableCell>
              <TableCell className='text-right'>{variant.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
