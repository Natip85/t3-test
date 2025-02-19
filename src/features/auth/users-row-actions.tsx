'use client'

import {type Row} from '@tanstack/react-table'
import {MoreHorizontal} from 'lucide-react'

import {Button} from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import {useState} from 'react'
import {ResponsiveDialog} from '@/components/responsive-dialog'
import {type UserSelect} from '@/features/auth/user-types'
import ProfileEditForm from '@/features/auth/profile-edit-form'

interface UsersRowActionsProps {
  row: Row<UserSelect>
}

// TODO make this a single component and pass in the user
export function UsersRowActions({row}: UsersRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        isEditOpen={setIsEditOpen}
        title='Edit profile'
        description={`Any edits to ${row.original.name}'s profile will reflect immediately.`}
      >
        <ProfileEditForm user={row.original} onSuccess={() => setIsEditOpen(false)} />
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
            <MoreHorizontal />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            className='font-button text-xl'
            onClick={() => {
              setIsEditOpen(true)
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
