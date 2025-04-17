'use client'

import {type ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/table/data-table-column-header'
import {ProductsRowActions} from './products-row-actions'
import {Button} from '@/ui/button'
import {type ProductSelect} from './product-types'
import {formatCurrency} from '@/lib/formatters'

export const columns: ColumnDef<ProductSelect>[] = [
  {
    accessorKey: 'id',
    header: ({column}) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({row}) => <div>{row.original.id}</div>,
  },
  {
    accessorKey: 'name',
    header: ({column}) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({row}) => <div>{row.original.name ?? ''}</div>,
  },
  {
    accessorKey: 'price',
    header: ({column}) => <DataTableColumnHeader column={column} title='Price' />,
    cell: ({row}) => <div>{formatCurrency((row.original.price || 0) / 100)}</div>,
  },
  {
    accessorKey: 'stockQuantity',
    header: ({column}) => <DataTableColumnHeader column={column} title='Stock quantity' />,
    cell: ({row}) => <div>{row.original.stockQuantity || 0}</div>,
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
