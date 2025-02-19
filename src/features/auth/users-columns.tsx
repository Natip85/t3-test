'use client'

import {type UserSelect} from '@/features/auth/user-types'
import {type ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/table/data-table-column-header'
import {UsersRowActions} from './users-row-actions'
import {Badge} from '@/ui/badge'
import {Button} from '@/ui/button'

export const columns: ColumnDef<UserSelect>[] = [
  {
    accessorKey: 'name',
    header: ({column}) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({row}) => <div>{row.original.name ?? ''}</div>,
  },
  {
    accessorKey: 'email',
    header: ({column}) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({row}) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: 'roles',
    header: () => (
      <Button variant={'ghost'} title='Roles'>
        Roles
      </Button>
    ),
    cell: ({row}) => (
      <div className='flex gap-2'>
        {row.original.roles.map((role) => (
          <Badge variant={'outline'} key={role}>
            {role}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: () => (
      <Button variant={'ghost'} title='Actions'>
        Actions
      </Button>
    ),
    cell: ({row}) => <UsersRowActions row={row} />,
  },
]
