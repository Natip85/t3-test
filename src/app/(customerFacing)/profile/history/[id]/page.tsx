import {api} from '@/trpc/server'
import Image from 'next/image'

type Props = {
  params: Promise<{id: string}>
}
export default async function page({params}: Props) {
  const {id} = await params
  const order = await api.orders.getById(Number(id))
  if (!order) {
    return <>No order found</>
  }
  return (
    <div className='mx-auto max-w-4xl p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Order #{order.id}</h1>

      <div className='mb-6 rounded-md p-4'>
        <p>
          <span className='font-semibold'>Status:</span> {order.status}
        </p>
        <p>
          <span className='font-semibold'>Total:</span> ${(order.totalAmount / 100).toFixed(2)}
        </p>
        <p>
          <span className='font-semibold'>Date:</span> {order.createdAt.toLocaleDateString()}
        </p>
        <p>
          <span className='font-semibold'>Payment ID:</span> {order.paymentIntentId}
        </p>
      </div>

      <div className='space-y-4'>
        <h2 className='mb-2 text-xl font-semibold'>Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className='flex items-center gap-4 rounded-md p-4 shadow-sm'>
            {item.image ? (
              <Image src={item.image} alt={item.name} width={64} height={64} className='rounded-md object-cover' />
            ) : (
              <div className='flex h-16 w-16 items-center justify-center rounded-md text-sm'>No image</div>
            )}
            <div>
              <p className='font-medium'>{item.name}</p>
              <p className='text-sm'>Quantity: {item.quantity}</p>
              <p className='text-sm'>Price: ${(item.price / 100).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
