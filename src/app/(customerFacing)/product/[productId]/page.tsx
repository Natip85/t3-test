import ProductDetailsSection from '@/features/products/product-details-section'
import ProductImage from '@/features/products/product-image'
import {api} from '@/trpc/server'

type Props = {
  params: Promise<{productId: string}>
}
export default async function ProductPage({params}: Props) {
  const {productId} = await params
  const prodId = Number(productId)
  const product = await api.products.getById(prodId)
  return (
    <div className='flex flex-1 flex-col justify-between gap-4 p-2 md:p-5 md:pt-20 lg:flex-row'>
      <div className='flex-shrink-0'>
        <ProductImage product={product} />
      </div>
      <ProductDetailsSection product={product} />
    </div>
  )
}
