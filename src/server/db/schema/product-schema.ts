import * as Utils from '@/server/db/utils'
import {index, serial, text, varchar, integer, numeric, timestamp} from 'drizzle-orm/pg-core'
import {relations} from 'drizzle-orm'
import {cartItem} from '.'

// 1. PRODUCTS
export const products = Utils.createTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 255}).notNull(),
    description: text('description'),
    price: numeric('price', {precision: 10, scale: 2}).default('0').notNull(),
    stockQuantity: integer('stock_quantity').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    nameIdx: index('product_name_idx').on(table.name),
  })
)

// 2. PRODUCT OPTIONS (e.g. Size, Color)
export const productOptions = Utils.createTable(
  'product_options',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 255}).notNull(),
    // position: integer('position'),
    productId: integer('product_id').references(() => products.id, {onDelete: 'cascade'}),
  },
  (table) => ({
    productIdIdx: index('product_options_product_id_idx').on(table.productId),
  })
)

// 3. OPTION VALUES (e.g. Red, Medium)
export const optionValues = Utils.createTable(
  'option_values',
  {
    id: serial('id').primaryKey(),
    value: varchar('value', {length: 255}).notNull(),
    optionId: integer('option_id').references(() => productOptions.id, {onDelete: 'cascade'}),
  },
  (table) => ({
    optionIdIdx: index('option_values_option_id_idx').on(table.optionId),
  })
)

// 4. VARIANTS (combinations of option values)
export const variants = Utils.createTable(
  'variants',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => products.id, {onDelete: 'cascade'}),
    sku: varchar('sku', {length: 50}).notNull(),
    price: numeric('price', {precision: 10, scale: 2}).default('0').notNull(),
    stock: integer('stock').default(0).notNull(),
  },
  (table) => ({
    productIdIdx: index('variants_product_id_idx').on(table.productId),
    skuIdx: index('variants_sku_idx').on(table.sku),
  })
)

// 5. VARIANT-OPTION-VALUE (pivot table for options per variant)
export const variantOptionValues = Utils.createTable(
  'variant_option_values',
  {
    id: serial('id').primaryKey(),
    variantId: integer('variant_id').references(() => variants.id, {onDelete: 'cascade'}),
    optionValueId: integer('option_value_id').references(() => optionValues.id, {onDelete: 'cascade'}),
  },
  (table) => ({
    variantIdIdx: index('variant_option_values_variant_id_idx').on(table.variantId),
    optionValueIdIdx: index('variant_option_values_option_value_id_idx').on(table.optionValueId),
  })
)

// RELATIONS TABLES
export const productRelations = relations(products, ({many}) => ({
  options: many(productOptions),
  variants: many(variants),
}))

export const productOptionRelations = relations(productOptions, ({one, many}) => ({
  product: one(products, {fields: [productOptions.productId], references: [products.id]}),
  values: many(optionValues),
}))

export const optionValueRelations = relations(optionValues, ({one, many}) => ({
  option: one(productOptions, {fields: [optionValues.optionId], references: [productOptions.id]}),
  variantValues: many(variantOptionValues),
}))

export const variantRelations = relations(variants, ({one, many}) => ({
  product: one(products, {fields: [variants.productId], references: [products.id]}),
  value: many(variantOptionValues),
  cartItem: many(cartItem),
}))

export const variantOptionValueRelations = relations(variantOptionValues, ({one}) => ({
  variant: one(variants, {fields: [variantOptionValues.variantId], references: [variants.id]}),
  value: one(optionValues, {fields: [variantOptionValues.optionValueId], references: [optionValues.id]}),
}))
