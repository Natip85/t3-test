import {TRPCError} from '@trpc/server'
import {createTRPCRouter, protectedProcedure, publicProcedure} from '@/server/api/trpc'
import {order} from '@/server/db/schema'
import {z} from 'zod'
import {eq} from 'drizzle-orm'

export const ordersRouter = createTRPCRouter({
  getByIntentId: publicProcedure.input(z.string()).query(async ({ctx, input}) => {
    const retries = 5
    const delayMs = 500

    for (let i = 0; i < retries; i++) {
      const result = await ctx.db.query.order.findFirst({
        where: eq(order.paymentIntentId, input),
        with: {
          items: true,
        },
      })

      if (result) {
        return result
      }

      console.log(`Retry ${i + 1}/${retries} - Order not found yet`)
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)))
    }

    return null
  }),

  getById: protectedProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.order.findFirst({
      where: eq(order.id, input),
      with: {
        items: true,
      },
    })

    return data
  }),
  getAllByUser: protectedProcedure.query(async ({ctx}) => {
    const data = await ctx.db.query.order.findMany({
      where: eq(order.userId, ctx.session.user.id),
      with: {
        items: true,
      },
    })

    return data
  }),
})
