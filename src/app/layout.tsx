import '@/styles/globals.css'

import {type Metadata} from 'next'
import {ThemeProvider} from 'next-themes'
import {SessionProvider} from 'next-auth/react'
import {NextSSRPlugin} from '@uploadthing/react/next-ssr-plugin'
import {extractRouterConfig} from 'uploadthing/server'
import {ourFileRouter} from '@/app/api/uploadthing/core'

import {TRPCReactProvider} from '@/trpc/react'
import {bebasNeue, anton, roboto} from '@/styles/fonts'

import {Toaster} from '@/ui/toaster'
// import { AnalyticsProvider } from "@/features/analytics/provider";
import {CookieBanner} from '@/features/analytics/banner'
import NuqsProvider from '@/components/nuqs-provider'

export const metadata: Metadata = {
  title: 'T3-Test',
  description: 'A t3 testing app',
  icons: [{rel: 'icon', url: '/favicon.ico'}],
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang='en'
      className={`${bebasNeue.variable} ${anton.variable} ${roboto.variable} font-sans`}
      suppressHydrationWarning
    >
      {/* <AnalyticsProvider> */}
      <body className='selection:bg-primary/50 selection:text-primary-foreground'>
        <TRPCReactProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <SessionProvider>
            <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
              <NuqsProvider>{children}</NuqsProvider>
              <Toaster />
              <CookieBanner />
            </ThemeProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
      {/* </AnalyticsProvider> */}
    </html>
  )
}
