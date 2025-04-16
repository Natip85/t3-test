import * as Utils from '@/server/db/utils'
import {relations} from 'drizzle-orm'
import {index, integer, serial} from 'drizzle-orm/pg-core'
import {cartItem} from '.'

export const product = Utils.createTable(
  'product',
  {
    id: serial('id').primaryKey().notNull(),
    name: Utils.chars('name').notNull(),
    description: Utils.chars('description'),
    price: integer('price').notNull(), // in cents
    imageUrl: Utils.chars('image_url'),
    stockQuantity: integer('stock_quantity').notNull(),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    nameIdx: index('product_name_idx').on(table.name),
    priceIdx: index('product_price_idx').on(table.price),
  })
)

export const productRelations = relations(product, ({many}) => ({
  variants: many(variant),
}))

export const variant = Utils.createTable(
  'variant',
  {
    id: serial('id').primaryKey().notNull(),
    productId: integer('product_id')
      .notNull()
      .references(() => product.id, {onDelete: 'cascade'}),
    name: Utils.chars('name').notNull(),
    sku: Utils.chars('sku').notNull().unique(),
    price: integer('price').notNull(),
    stockQuantity: integer('stock_quantity').notNull(),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    productIdIdx: index('variant_product_id_idx').on(table.productId),
    skuIdx: index('variant_sku_idx').on(table.sku),
    priceIdx: index('variant_price_idx').on(table.price),
  })
)

export const variantRelations = relations(variant, ({one, many}) => ({
  product: one(product, {fields: [variant.productId], references: [product.id]}),
  cartItems: many(cartItem),
  variantOptions: many(variantOption),
}))

export const option = Utils.createTable(
  'option',
  {
    id: serial('id').primaryKey().notNull(),
    name: Utils.chars('name').notNull().unique(), // Example: Color, Size, etc.
  },
  (table) => ({
    optionNameIdx: index('option_name_idx').on(table.name),
  })
)

export const optionValue = Utils.createTable('option_value', {
  id: serial('id').primaryKey().notNull(),
  optionId: integer('option_id')
    .notNull()
    .references(() => option.id, {onDelete: 'cascade'}),
  value: Utils.chars('value').notNull(), // Example: Red, Large, etc.
})

// === VARIANT OPTION (JOIN TABLE) ===
export const variantOption = Utils.createTable(
  'variant_option',
  {
    variantId: integer('variant_id')
      .notNull()
      .references(() => variant.id, {onDelete: 'cascade'}),
    optionId: integer('option_id')
      .notNull()
      .references(() => option.id, {onDelete: 'cascade'}),
    optionValueId: integer('option_value_id')
      .notNull()
      .references(() => optionValue.id, {onDelete: 'cascade'}),
  },
  (table) => ({
    pk: index('variant_option_pk').on(table.variantId, table.optionId, table.optionValueId),
    variantIdx: index('variant_option_variant_idx').on(table.variantId),
    optionIdx: index('variant_option_option_idx').on(table.optionId),
    optionValueIdx: index('variant_option_option_value_idx').on(table.optionValueId),
  })
)

export const variantOptionRelations = relations(variantOption, ({one}) => ({
  option: one(option, {fields: [variantOption.optionId], references: [option.id]}),
  variant: one(variant, {fields: [variantOption.variantId], references: [variant.id]}),
  optionValue: one(optionValue, {fields: [variantOption.optionValueId], references: [optionValue.id]}),
}))
