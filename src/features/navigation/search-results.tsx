'use client'
import ProductCard from '../products/product-card'
import {type Product} from '../products/product-types'

type Props = {results: Product[]}

export default function SearchResults({results}: Props) {
  return (
    <main className='flex-1'>
      <div className='p-4 md:p-6'>
        <div className='mb-6'>
          <h2 className='mb-4 text-lg font-semibold'>Results ({results.length})</h2>
          <div className='mx-auto grid w-fit grid-cols-2 gap-3 lg:grid-cols-3'>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// export function GridSkeleton() {
//   return (
//     <div className='grid grid-cols-2 gap-4 bg-red-500 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
//       {Array.from({length: 10}).map((_, i) => (
//         <Skeleton key={i} className='aspect-square w-full rounded-md' />
//       ))}
//     </div>
//   )
// }
