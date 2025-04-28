import {TRPCError} from '@trpc/server'
import {createTRPCRouter, protectedProcedure, publicProcedure} from '@/server/api/trpc'
import {order} from '@/server/db/schema'
import {z} from 'zod'
import {eq} from 'drizzle-orm'

export const ordersRouter = createTRPCRouter({
  getByIntentId: publicProcedure.input(z.string()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.order.findFirst({
      where: eq(order.paymentIntentId, input),
      with: {
        items: true,
      },
    })

    return data
  }),
})
