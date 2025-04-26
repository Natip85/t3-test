import * as Utils from '@/server/db/utils'
import {index, integer, serial, text} from 'drizzle-orm/pg-core'
import {products, users, variants} from '.'
import {relations} from 'drizzle-orm'

export const cart = Utils.createTable(
  'cart',
  {
    id: serial('id').primaryKey().notNull(),
    userId: Utils.userId().references(() => users.id, {onDelete: 'cascade'}),
    totalAmount: integer('total_amount').notNull().default(0),
    totalQuantity: integer('total_quantity').notNull().default(0),
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
    productId: integer('product_id')
      .references(() => products.id, {onDelete: 'cascade'})
      .notNull(),
    variantId: integer('variant_id').references(() => variants.id, {onDelete: 'set null'}),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    quantity: integer('quantity').notNull().default(1),
    image: text('image'),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    cartIdIdx: index('cart_id_idx').on(table.cartId),
    cartVariantIdx: index('cart_variant_idx').on(table.cartId, table.variantId),
  })
)

export const cartItemsRelations = relations(cartItem, ({one}) => ({
  cart: one(cart, {fields: [cartItem.cartId], references: [cart.id]}),
  productVariant: one(variants, {fields: [cartItem.variantId], references: [variants.id]}),
}))
