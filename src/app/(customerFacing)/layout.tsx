import Footer from '@/features/navigation/footer'
import Navbar from '@/features/navigation/navbar'
import CartProvider from '@/lib/cart-provider'
import {HydrateClient} from '@/trpc/server'
import {type Metadata} from 'next'

export const metadata: Metadata = {
  title: 'T3-testing',
  description: 'A t3 app',
  icons: [{rel: 'icon', url: '/favicon.ico'}],
}

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <HydrateClient>
      <div className='relative flex min-h-screen flex-col'>
        <Navbar />
        <main className='flex flex-1'>
          <CartProvider>{children}</CartProvider>
        </main>
        <Footer />
      </div>
    </HydrateClient>
  )
}
