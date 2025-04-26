import {TRPCError} from '@trpc/server'

import {createTRPCRouter, protectedProcedure, publicProcedure} from '@/server/api/trpc'
import {eq} from 'drizzle-orm'
import {cart, cartItem} from '@/server/db/schema'
import {z} from 'zod'
import {cartCreateSchema} from './cart-types'

export const cartsRouter = createTRPCRouter({
  createCart: protectedProcedure.input(cartCreateSchema).mutation(async ({ctx, input}) => {
    console.log('createCart>>>>', input)

    if (!ctx.session.user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return ctx.db.transaction(async (tx) => {
      const [newCart] = await tx
        .insert(cart)
        .values({
          userId: ctx.session.user.id,
          totalAmount: input.totalAmount,
          totalQuantity: input.totalQuantity,
        })
        .returning({id: cart.id})
      if (!newCart) {
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create cart'})
      }
      // 2. Insert all cart items
      if (input.items.length > 0) {
        await tx.insert(cartItem).values(
          input.items.map((item) => ({
            cartId: newCart.id,
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        )
      }

      return newCart.id
    })
  }),
  getById: publicProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.cart.findFirst({
      where: eq(cart.id, input),
      with: {
        user: true,
        cartItems: {with: {productVariant: true}},
      },
    })
    return data
  }),
})
