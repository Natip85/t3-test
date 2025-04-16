import * as Utils from '@/server/db/utils'
import {index, integer, serial} from 'drizzle-orm/pg-core'
import {variant, users} from '.'
import {relations} from 'drizzle-orm'

export const cart = Utils.createTable(
  'cart',
  {
    id: serial('id').primaryKey().notNull(),
    userId: Utils.userId().references(() => users.id, {onDelete: 'cascade'}),
    date: Utils.timeStamp('date'),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    userIdIdx: index('cart_user_unique').on(table.userId),
  })
)

export const cartsRelations = relations(cart, ({one, many}) => ({
  user: one(users, {fields: [cart.userId], references: [users.id]}),
  cartItems: many(cartItem),
}))

export const cartItem = Utils.createTable(
  'cart_item',
  {
    id: serial('id').primaryKey().notNull(),
    cartId: integer('cart_id')
      .references(() => cart.id, {onDelete: 'cascade'})
      .notNull(),
    productVariantId: integer('product_variant_id').references(() => variant.id, {onDelete: 'cascade'}),
    quantity: integer('quantity').notNull().default(1),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    cartIdIdx: index('cart_id_idx').on(table.cartId),
    cartVariantIdx: index('cart_variant_idx').on(table.cartId, table.productVariantId),
  })
)

export const cartItemsRelations = relations(cartItem, ({one}) => ({
  cart: one(cart, {fields: [cartItem.cartId], references: [cart.id]}),
  productVariant: one(variant, {fields: [cartItem.productVariantId], references: [variant.id]}),
}))
