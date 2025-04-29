import {DataTable} from '@/components/table/data-table'
import ProfileMenu from '@/features/navigation/profile-menu'
import {columns} from '@/features/order/orders-columns'
import {api} from '@/trpc/server'

export default async function HistoryPage() {
  const orders = await api.orders.getAllByUser()

  return (
    <div className='flex-1 justify-between gap-4 p-2 md:flex md:p-10'>
      <ProfileMenu />
      <DataTable columns={columns} data={orders} />
    </div>
  )
}
