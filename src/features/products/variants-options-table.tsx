import {type Product} from './product-types'

interface Props {
  product?: Product
  onOptionClick?: (optionValue: {id: string | number; value: string}) => void
}

export default function VariantOptionsTable({product, onOptionClick}: Props) {
  // Create a 2D array where each row represents a variant's options
  const data = product?.variants.map((variant) => variant.variantOptions.map((option) => option)) || []

  if (data.length === 0) {
    return <div className='text-muted-foreground'>No variant options available</div>
  }

  // Handle option click
  // const handleOptionClick = (item: any, e: React.MouseEvent) => {
  //   if (onOptionClick) {
  //     e.preventDefault() // Prevent default if we have a custom handler
  //     onOptionClick(item.optionValue)
  //   }
  // }

  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Product Variant Options</CardTitle>
    //   </CardHeader>
    //   <CardContent className='space-y-6'>
    //     {data.map((row, rowIndex) => (
    //       <div key={rowIndex} className='space-y-2'>
    //         <h3 className='text-lg font-medium'>{row[0]?.option?.name || 'Option'}</h3>

    //         <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
    //           {row.map((item, i) => (
    //             <Link
    //               href={`/admin/products/${product?.id}/variant/${item.optionValue.id}`}
    //               key={i}
    //               onClick={(e) => handleOptionClick(item, e)}
    //               className='cursor-pointer rounded-md border px-4 py-2 text-center transition-colors hover:border-primary hover:bg-muted'
    //             >
    //               <div>{item.optionValue.value}</div>
    //             </Link>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </CardContent>
    // </Card>
    <div>ddddd</div>
  )
}
