import {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {type RouterOutputs} from '@/trpc/react'
import {cart, cartItem} from '@/server/db/schema'

export const cartInsertSchema = createInsertSchema(cart)
export type CartInsert = z.infer<typeof cartInsertSchema>

export const cartSelectSchema = createSelectSchema(cart)
export type CartSelect = z.infer<typeof cartSelectSchema>

export const cartItemInsertSchema = createInsertSchema(cartItem)
export type CartItemInsert = z.infer<typeof cartItemInsertSchema>

export const cartItemSelectSchema = createSelectSchema(cartItem)
export type CartItemSelect = z.infer<typeof cartItemSelectSchema>

export const cartCreateSchema = createSelectSchema(cart)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    items: z.array(
      cartItemSelectSchema.omit({id: true, createdAt: true, updatedAt: true, cartId: true, image: true}).extend({
        variantId: z.number().nullable().optional(),
      })
    ),
  })
export type CartCreateSelect = z.infer<typeof cartCreateSchema>

export type Cart = NonNullable<RouterOutputs['carts']['getById']>
