// app/providers.js
'use client'
import {useEffect} from 'react'
import posthog from 'posthog-js'
import {PostHogProvider} from 'posthog-js/react'
import {env} from '@/env'
import {cookieConsentGiven} from './banner'

const initPostHog = () => {
  if (typeof window !== 'undefined' && !env.NEXT_PUBLIC_IS_DEV) {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      persistence: cookieConsentGiven() === true ? 'localStorage+cookie' : 'memory',
      person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
    })
  }
}

export function AnalyticsProvider({children}: Readonly<{children: React.ReactNode}>) {
  useEffect(() => {
    initPostHog()
  }, [])
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
