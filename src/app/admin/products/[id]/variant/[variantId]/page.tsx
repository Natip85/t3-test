import VariantEditForm from '@/features/products/variant-edit-form'
import VariantMenuItems from '@/features/products/variant-menu-items'
import {api} from '@/trpc/server'
import {buttonVariants} from '@/ui/button'
import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
type Props = {
  params: Promise<{id: string; variantId: string}>
}
export default async function VariantPage({params}: Props) {
  const {id, variantId} = await params

  const [variant, variants, product] = await Promise.all([
    api.products.getVariantById(parseInt(variantId)),
    api.products.getVariants(parseInt(id)),
    api.products.getById(parseInt(id)),
  ])

  return (
    <div className='p-2 md:p-5'>
      <div className='mx-auto mb-5 flex max-w-6xl items-center gap-2'>
        <Link href={`/admin/products/${id}`} className={buttonVariants({variant: 'ghost', size: 'sm'})}>
          <ArrowLeft />
        </Link>
        <span className='text-2xl font-bold'> {variant?.value.map((val) => val.value?.value).join(' / ')}</span>
      </div>
      <div className='mx-auto flex max-w-6xl flex-col justify-between gap-10 md:flex-row'>
        <div className='w-full md:w-1/3'>
          <VariantMenuItems variants={variants} variantId={variantId} product={product} />
        </div>
        <div className='flex-1'>
          <VariantEditForm variant={variant} />
        </div>
      </div>
    </div>
  )
}
