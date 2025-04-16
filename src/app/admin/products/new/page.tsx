import CreateProductForm from '@/features/products/create-product-form'

export default async function AddProductPage() {
  return (
    <div className='flex-1 space-y-5 p-2 md:p-5'>
      <CreateProductForm />
    </div>
  )
}
