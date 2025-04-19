import {DataTable} from '@/components/table/data-table'
import {columns} from '@/features/products/products-columns'
import {api} from '@/trpc/server'
import {buttonVariants} from '@/ui/button'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const products = await api.products.getAll()

  return (
    <div className='p-2 md:p-5'>
      <div className='flex items-center justify-end'>
        <Link href={'/admin/products/new'} className={buttonVariants()}>
          Add a product
        </Link>
      </div>
      <DataTable data={products} columns={columns} />
    </div>
  )
}
