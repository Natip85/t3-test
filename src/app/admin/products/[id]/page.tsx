import CreateProductForm from '@/features/products/create-product-form'
import {api} from '@/trpc/server'
import {buttonVariants} from '@/ui/button'
import Link from 'next/link'

type Props = {
  params: Promise<{id: string}>
}
export default async function AddProductPage({params}: Props) {
  const {id} = await params
  const productId = Number(id)

  if (isNaN(productId)) {
    return (
      <div>
        <div>Invalid product ID</div>
        <div>
          <Link href='/admin/products' className={buttonVariants()}>
            Back to offenders
          </Link>
        </div>
      </div>
    )
  }

  const product = await api.products.getById(parseInt((await params).id))

  return (
    <div className='p-2 md:p-5'>
      <CreateProductForm product={product} />
    </div>
  )
}
