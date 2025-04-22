'use client'

import {type Row} from '@tanstack/react-table'
import {MoreHorizontal} from 'lucide-react'

import {Button} from '@/ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/ui/dropdown-menu'
import {type ProductSelect} from './product-types'
import {useRouter} from 'next/navigation'

interface UsersRowActionsProps {
  row: Row<ProductSelect>
}

export function ProductsRowActions({row}: UsersRowActionsProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <MoreHorizontal />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px] bg-background'>
        <DropdownMenuItem
          className='font-button text-xl'
          onClick={() => router.push(`/admin/products/${row.original.id}`)}
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
