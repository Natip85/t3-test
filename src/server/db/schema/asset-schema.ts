import {index, jsonb, pgEnum, serial, timestamp} from 'drizzle-orm/pg-core'

import * as Utils from '../utils'
import {users} from './user-schema'
import {AssetTypes} from './schema-constants'
import {relations} from 'drizzle-orm'
import {productAsset, variantAsset} from '.'
import {type AssetFileInfo} from '@/features/assets/asset-types'

export const AssetTypesEnum = pgEnum('asset_type', AssetTypes)

export const assets = Utils.createTable(
  'asset',
  {
    id: serial('id').primaryKey(),
    description: Utils.chars('description'),
    type: AssetTypesEnum('type').notNull(),
    url: Utils.chars('url').notNull(),
    originalUrl: Utils.chars('original_url'),
    fileInfo: jsonb('file_info').$type<AssetFileInfo>(),
    createdByUserId: Utils.userId('created_by_user_id').references(() => users.id),
    captureDate: Utils.timeStamp('capture_date'),
    deletedAt: timestamp('deleted_at', {mode: 'date'}),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    createdByUserIdIdx: index('asset_created_by_user_id_idx').on(table.createdByUserId),
    typeIdx: index('asset_type_idx').on(table.type),
    urlIdx: index('asset_url_idx').on(table.url),
  })
)

export const assetRelations = relations(assets, ({one, many}) => ({
  createdByUser: one(users, {fields: [assets.createdByUserId], references: [users.id]}),
  productAssets: many(productAsset),
  variantAssets: many(variantAsset),
}))
