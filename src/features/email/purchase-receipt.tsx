import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components'
import {type CartItemSelect} from '../cart/cart-types'
import {type OrderSelect} from '../order/order-types'
import {formatCurrency} from '@/lib/formatters'
import {env} from '@/env'
type CartItemWithoutcartId = Omit<CartItemSelect, 'cartId'>

type PurchaseReceiptEmailProps = {
  products?: CartItemWithoutcartId[]
  order: OrderSelect
}

export default function PurchaseReceiptEmail({products, order}: PurchaseReceiptEmailProps) {
  if (!products || products.length === 0) {
    return <>prob</>
  }
  return (
    <Html>
      <Preview>View your receipt and ENJOY!</Preview>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 mr-4 whitespace-nowrap text-nowrap text-gray-500'>Order ID</Text>
                  <Text className='mr-4 mt-0'>{order.id}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 mr-4 whitespace-nowrap text-nowrap text-gray-500'>Purchased On</Text>
                  <Text className='mr-4 mt-0'>{order.createdAt.toLocaleDateString()}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 mr-4 whitespace-nowrap text-nowrap text-gray-500'>Price Paid</Text>
                  <Text className='mr-4 mt-0'>{formatCurrency(order.totalAmount)}</Text>
                </Column>
              </Row>
            </Section>
            {products.map((product) => (
              <Section key={product.id} className='my-4 rounded-lg border border-solid border-gray-500 p-4 md:p-6'>
                <Img width='100%' alt={'prod img'} src={product.image ?? ''} />
                <Row className='mt-8'>
                  <Column className='align-bottom'>
                    <Text className='m-0 mr-4 text-lg font-bold'>{product.name}</Text>
                  </Column>
                  <Column align='right'>
                    <Button
                      href={`${env.NEXT_PUBLIC_SERVER_URL}/profile/history/${order.id}`}
                      className='rounded bg-black px-6 py-4 text-lg text-white'
                    >
                      View order
                    </Button>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className='mb-0 text-gray-500'>{product.name}</Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
