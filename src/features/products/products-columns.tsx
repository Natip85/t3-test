'use client'

import {type ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/table/data-table-column-header'
import {ProductsRowActions} from './products-row-actions'
import {Button} from '@/ui/button'
import {type ProductSelect} from './product-types'

export const columns: ColumnDef<ProductSelect>[] = [
  {
    accessorKey: 'name',
    header: ({column}) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({row}) => <div>{row.original.name ?? ''}</div>,
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
