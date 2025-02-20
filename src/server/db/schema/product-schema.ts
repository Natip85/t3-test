import * as Utils from '@/server/db/utils'
import {relations} from 'drizzle-orm'
import {serial, index, text, integer} from 'drizzle-orm/pg-core'
import {cartItem} from '.'

export const product = Utils.createTable(
  'product',
  {
    id: serial('id').primaryKey().notNull(),
    publicId: text('public_id')
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    name: Utils.chars('name').notNull(),
    description: Utils.chars('description'),
    price: integer('price').notNull(), // in cents
    imageUrl: Utils.chars('image_url'),
    stockQuantity: integer('stock_quantity').notNull(),
    date: Utils.timeStamp('date'),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    nameIdx: index('product_name_idx').on(table.name),
  })
)

export const productRelations = relations(product, ({many}) => ({
  variants: many(productVariant),
}))

export const productVariant = Utils.createTable(
  'product_variant',
  {
    id: serial('id').primaryKey().notNull(),
    productId: integer('product_id')
      .notNull()
      .references(() => product.id, {onDelete: 'cascade'}),
    sku: Utils.chars('sku').notNull().unique(),
    price: integer('price').notNull(),
    stockQuantity: integer('stock_quantity').notNull(),
    color: Utils.chars('color'),
    size: Utils.chars('size'),
    date: Utils.timeStamp('date'),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    productIdIdx: index('product_variant_product_id_idx').on(table.productId),
  })
)

export const productVariantRelations = relations(productVariant, ({one, many}) => ({
  product: one(product, {fields: [productVariant.productId], references: [product.id]}),
  cartItems: many(cartItem),
}))
