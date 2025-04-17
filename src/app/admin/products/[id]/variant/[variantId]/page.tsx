import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'
type Props = {
  params: Promise<{id: string; variantId: string}>
}
export default async function VariantPage({params}: Props) {
  const {id, variantId} = await params

  return (
    <div>
      <div>
        <Link href={`/admin/products/${id}`}>
          <ArrowLeft />
        </Link>
      </div>
      <div>
        {id}
        {variantId}
      </div>
    </div>
  )
}
