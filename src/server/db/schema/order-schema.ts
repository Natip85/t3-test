import * as Utils from '@/server/db/utils'
import {index, integer, serial, text, varchar} from 'drizzle-orm/pg-core'
import {products, users, variants} from '.'
import {relations} from 'drizzle-orm'

export const order = Utils.createTable(
  'order',
  {
    id: serial('id').primaryKey().notNull(),
    userId: Utils.userId()
      .references(() => users.id, {onDelete: 'cascade'})
      .notNull(),
    totalAmount: integer('total_amount').notNull(),
    status: varchar('status', {length: 50}).notNull(),
    paymentIntentId: varchar('payment_intent_id', {length: 255}).notNull(),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    userIdIdx: index('order_user_unique').on(table.userId),
  })
)
export const orderRelations = relations(order, ({one, many}) => ({
  user: one(users, {fields: [order.userId], references: [users.id]}),
  items: many(orderItems),
}))

export const orderItems = Utils.createTable(
  'order_items',
  {
    id: serial('id').primaryKey().notNull(),
    orderId: integer('order_id')
      .references(() => order.id, {onDelete: 'cascade'})
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
    orderIdIdx: index('order_id_idx').on(table.orderId),
    orderVariantIdx: index('order_variant_idx').on(table.orderId, table.variantId),
  })
)

export const orderItemRelations = relations(orderItems, ({one}) => ({
  order: one(order, {fields: [orderItems.orderId], references: [order.id]}),
}))
