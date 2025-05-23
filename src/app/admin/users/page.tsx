import {DataTable} from '@/components/table/data-table'
import {columns} from '@/features/auth/users-columns'
import {api} from '@/trpc/server'

export default async function UsersPage() {
  const users = await api.users.getAll()

  return (
    <div className='p-2 md:p-5'>
      <DataTable data={users} columns={columns} />
    </div>
  )
}
