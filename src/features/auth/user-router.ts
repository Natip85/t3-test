import {TRPCError} from '@trpc/server'
import {desc, eq} from 'drizzle-orm'
import {z} from 'zod'
import {pickBy} from 'lodash-es'

import {createTRPCRouter, protectedProcedure} from '@/server/api/trpc'

import {userProfileFormSchema} from './user-types'
import {hasPermission} from '@/lib/permissions'
import {users} from '@/server/db/schema'

export const usersRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ctx}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session?.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        language: true,
        image: true,
        phone: true,
        roles: true,
      },
    })

    if (!hasPermission(ctx.session?.user, 'users', 'view', user)) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return user
  }),
  // TODO lock this down
  updateMe: protectedProcedure.input(userProfileFormSchema.partial()).mutation(async ({ctx, input}) => {
    if (!hasPermission(ctx.session?.user, 'users', 'edit', input)) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id: _id, email: _email, ...rest} = input
    const updatableFields = pickBy(rest, (value) => !!value)

    const [updated] = await ctx.db
      .update(users)
      .set(updatableFields)
      .where(eq(users.id, ctx.session.user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        language: users.language,
        image: users.image,
        phone: users.phone,
      })
    return updated
  }),
  getById: protectedProcedure.input(z.string()).query(async ({ctx, input}) => {
    const user = await ctx.db.query.users.findFirst({where: eq(users.id, input)})

    if (!hasPermission(ctx.session?.user, 'users', 'view', user)) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return user
  }),
  getAll: protectedProcedure.query(async ({ctx}) => {
    if (!hasPermission(ctx.session?.user, 'users', 'view')) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return await ctx.db.query.users.findMany({
      orderBy: desc(users.email),
    })
  }),
})
