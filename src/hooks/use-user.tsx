'use client'

import {type UserLanguage, type UserRole} from '@/server/db/schema'
import {api} from '@/trpc/react'
import {type User} from 'next-auth'
import {useSession} from 'next-auth/react'

/**
 * For places where the user is required to be logged in, use this hook. Otherwise, use the session hook.
 */
export const useUser = () => {
  const {data: session, status, update: sessionUpdate} = useSession()
  const {
    data: user,
    isLoading,
    refetch,
  } = api.users.getMe.useQuery(undefined, {
    enabled: status === 'authenticated',
  })

  const update = async (data: Partial<User>) => {
    await Promise.allSettled([sessionUpdate({user: data}), refetch()])
  }

  const exposedProps = {
    update,
    session,
    refetch,
    isAuthenticated: status === 'authenticated',
  }

  if (status === 'loading' || isLoading || !session?.user || !user) {
    return {
      user: {
        id: session?.user?.id ?? '',
        name: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
        image: session?.user?.image ?? '',
        phone: '',
        language: session?.user?.language ?? ('en' as UserLanguage),
        roles: session?.user?.roles ?? (['user'] as UserRole[]),
      },
      ...exposedProps,
    }
  }

  return {
    user: {
      ...user,
      name: user.name ?? '',
      image: user.image ?? '',
      email: user.email ?? '',
      language: user.language ?? ('en' as UserLanguage),
      roles: user.roles ?? (['user'] as UserRole[]),
    },
    ...exposedProps,
  }
}
