import * as Utils from '@/server/db/utils'
import {index, serial, text, varchar, integer, numeric, timestamp, unique} from 'drizzle-orm/pg-core'
import {relations} from 'drizzle-orm'
import {cartItem} from '.'
import {assets} from './asset-schema'

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

export const productAsset = Utils.createTable(
  'product_asset',
  {
    id: serial('id').primaryKey().notNull(),
    productId: integer('prod_id')
      .references(() => products.id, {onDelete: 'cascade'})
      .notNull(),
    assetId: integer('asset_id')
      .references(() => assets.id, {onDelete: 'cascade'})
      .notNull(),
    ...Utils.createUpdateTimestamps,
    deletedAt: timestamp('deleted_at', {mode: 'date'}),
  },
  (table) => ({
    uniquePair: unique('product_asset_unique_pair_idx').on(table.productId, table.assetId),
    productIdIdx: index('product_asset_product_id_idx').on(table.productId),
    assetIdIdx: index('product_asset_asset_id_idx').on(table.assetId),
  })
)

export const variantAsset = Utils.createTable(
  'variant_asset',
  {
    id: serial('id').primaryKey().notNull(),
    variantId: integer('varia_id')
      .references(() => variants.id, {onDelete: 'cascade'})
      .notNull(),
    assetId: integer('assett_id')
      .references(() => assets.id, {onDelete: 'cascade'})
      .notNull(),
    ...Utils.createUpdateTimestamps,
    deletedAt: timestamp('deleted_at', {mode: 'date'}),
  },
  (table) => ({
    uniquePair: unique('variant_asset_unique_pair_idx').on(table.variantId, table.assetId),
    variantIdIdx: index('variant_asset_variant_id_idx').on(table.variantId),
    assetIdIdx: index('variant_asset_asset_id_idx').on(table.assetId),
  })
)

// RELATIONS TABLES
export const productRelations = relations(products, ({many}) => ({
  options: many(productOptions),
  variants: many(variants),
  assets: many(productAsset),
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
  assets: many(variantAsset),
}))

export const variantOptionValueRelations = relations(variantOptionValues, ({one}) => ({
  variant: one(variants, {fields: [variantOptionValues.variantId], references: [variants.id]}),
  value: one(optionValues, {fields: [variantOptionValues.optionValueId], references: [optionValues.id]}),
}))

export const productAssetRelations = relations(productAsset, ({one}) => ({
  product: one(products, {fields: [productAsset.productId], references: [products.id]}),
  asset: one(assets, {fields: [productAsset.assetId], references: [assets.id]}),
}))
export const variantAssetRelations = relations(variantAsset, ({one}) => ({
  variant: one(variants, {fields: [variantAsset.variantId], references: [variants.id]}),
  asset: one(assets, {fields: [variantAsset.assetId], references: [assets.id]}),
}))
