'use client'

import {type ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/table/data-table-column-header'
import {ProductsRowActions} from './products-row-actions'
import {Button} from '@/ui/button'
import {type Product} from './product-types'
import {formatCurrency} from '@/lib/formatters'
import Image from 'next/image'
import {ImageIcon} from 'lucide-react'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: ({column}) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({row}) => <div>{row.original.id}</div>,
  },
  {
    id: 'image', // Add an explicit 'id' field for this column
    accessorFn: (row) => row.assets[0]?.asset.fileInfo?.url, // Extract image URL from the assets field
    header: () => <Button variant='ghost'>Image</Button>,
    cell: ({row}) => {
      const imageUrl = row.original.assets[0]?.asset.fileInfo?.url ?? '' // Use the custom accessorFn value
      return (
        <div className='relative aspect-square h-10 w-10'>
          {imageUrl ? (
            <Image src={imageUrl} alt='product img' fill className='rounded-md object-cover' />
          ) : (
            <ImageIcon className='size-full' />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({column}) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({row}) => <div className='flex items-center gap-2'>{row.original.name ?? ''}</div>,
  },
  {
    accessorKey: 'price',
    header: ({column}) => <DataTableColumnHeader column={column} title='Price' />,
    cell: ({row}) => <div>{formatCurrency(row.original.price || 0)}</div>,
  },
  {
    accessorKey: 'stockQuantity',
    header: ({column}) => <DataTableColumnHeader column={column} title='Stock quantity' />,
    cell: ({row}) => <div>{row.original.stockQuantity || 0}</div>,
  },
  {
    accessorKey: 'active',
    header: ({column}) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({row}) => <div className='flex items-center gap-2'>{row.original.active ?? ''}</div>,
  },
  {
    accessorKey: 'actions',
    header: () => (
      <Button variant={'ghost'} title='Actions'>
        Actions
      </Button>
    ),
    cell: ({row}) => <ProductsRowActions row={row} />,
  },
]
