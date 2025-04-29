'use client'

import {type ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/table/data-table-column-header'
import {Button} from '@/ui/button'
import {type OrderSelect} from './order-types'
import {formatCurrency} from '@/lib/formatters'
import {OrdersRowActions} from './orders-row-actions'

export const columns: ColumnDef<OrderSelect>[] = [
  {
    accessorKey: 'id',
    header: ({column}) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({row}) => <div>{row.original.id}</div>,
  },
  {
    accessorKey: 'status',
    header: ({column}) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({row}) => <div>{row.original.status}</div>,
  },
  {
    accessorKey: 'totalAmount',
    header: ({column}) => <DataTableColumnHeader column={column} title='Total amount' />,
    cell: ({row}) => <div>{formatCurrency(row.original.totalAmount)}</div>,
  },

  {
    accessorKey: 'actions',
    header: () => (
      <Button variant={'ghost'} title='Actions'>
        Actions
      </Button>
    ),
    cell: ({row}) => <OrdersRowActions row={row} />,
  },
]
