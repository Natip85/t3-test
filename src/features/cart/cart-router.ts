import {TRPCError} from '@trpc/server'
import {createTRPCRouter, protectedProcedure, publicProcedure} from '@/server/api/trpc'
import {cart, cartItem} from '@/server/db/schema'
import {z} from 'zod'
import {eq, and, isNull} from 'drizzle-orm'

export const cartsRouter = createTRPCRouter({
  createCart: protectedProcedure.mutation(async ({ctx}) => {
    if (!ctx.session.user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    const [newCart] = await ctx.db
      .insert(cart)
      .values({
        userId: ctx.session.user.id,
        totalAmount: 0,
        totalQuantity: 0,
      })
      .returning({id: cart.id})

    if (!newCart) {
      throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create cart'})
    }

    return newCart.id
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        cartId: z.number(),
        productId: z.number(),
        variantId: z.number().nullable().optional(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ctx, input}) => {
      const {cartId, image, productId, variantId, name, price, quantity} = input

      // 1. Insert the new cart item
      await ctx.db.insert(cartItem).values({
        cartId,
        productId,
        variantId,
        name,
        price,
        quantity,
        image,
      })

      // 2. Recalculate totalAmount and totalQuantity for the cart
      const cartItems = await ctx.db.query.cartItem.findMany({
        where: eq(cartItem.cartId, cartId),
      })

      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

      // 3. Update the cart with the new totals
      await ctx.db
        .update(cart)
        .set({
          totalAmount,
          totalQuantity,
        })
        .where(eq(cart.id, cartId))
    }),

  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        cartId: z.number(),
        productId: z.number(),
        variantId: z.number().nullable(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ctx, input}) => {
      const {cartId, productId, variantId, quantity} = input

      // 1. Update the cart item quantity
      await ctx.db
        .update(cartItem)
        .set({quantity})
        .where(
          and(
            eq(cartItem.cartId, cartId),
            eq(cartItem.productId, productId),
            variantId === null ? isNull(cartItem.variantId) : eq(cartItem.variantId, variantId)
          )
        )

      // 2. Recalculate the totalAmount and totalQuantity for the cart
      const cartItems = await ctx.db.query.cartItem.findMany({
        where: eq(cartItem.cartId, cartId),
      })

      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

      // 3. Update the cart totals
      await ctx.db
        .update(cart)
        .set({
          totalAmount,
          totalQuantity,
        })
        .where(eq(cart.id, cartId))
    }),

  removeItem: protectedProcedure
    .input(
      z.object({
        cartId: z.number(),
        productId: z.number(),
        variantId: z.number().nullable(),
      })
    )
    .mutation(async ({ctx, input}) => {
      const {cartId, productId, variantId} = input

      // 1. Remove the cart item
      await ctx.db
        .delete(cartItem)
        .where(
          and(
            eq(cartItem.cartId, cartId),
            eq(cartItem.productId, productId),
            variantId === null ? isNull(cartItem.variantId) : eq(cartItem.variantId, variantId)
          )
        )

      // 2. Recalculate the totalAmount and totalQuantity for the cart
      const cartItems = await ctx.db.query.cartItem.findMany({
        where: eq(cartItem.cartId, cartId),
      })

      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

      // 3. Update the cart totals
      await ctx.db
        .update(cart)
        .set({
          totalAmount,
          totalQuantity,
        })
        .where(eq(cart.id, cartId))
    }),

  getById: publicProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.cart.findFirst({
      where: eq(cart.id, input),
      with: {
        cartItems: {with: {productVariant: true}},
      },
    })

    return data
  }),

  getUserCart: publicProcedure.query(async ({ctx}) => {
    if (!ctx.session?.user || !ctx.session.user.id) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }
    const data = await ctx.db.query.cart.findFirst({
      where: eq(cart.userId, ctx.session.user.id),
      with: {
        cartItems: {with: {productVariant: true}},
      },
    })

    return data
  }),
})
