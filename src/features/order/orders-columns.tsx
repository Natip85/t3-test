'use client'

import {type ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/table/data-table-column-header'
import {Button} from '@/ui/button'
import {type OrderSelect} from './order-types'

export const columns: ColumnDef<OrderSelect>[] = [
  {
    accessorKey: 'id',
    header: ({column}) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({row}) => <div>{row.original.id}</div>,
  },

  // {
  //   accessorKey: 'actions',
  //   header: () => (
  //     <Button variant={'ghost'} title='Actions'>
  //       Actions
  //     </Button>
  //   ),
  //   cell: ({row}) => <ProductsRowActions row={row} />,
  // },
]
