import * as Utils from '@/server/db/utils'
import {boolean, index, integer, pgEnum, primaryKey, serial, text, unique} from 'drizzle-orm/pg-core'

export const cart = Utils.createTable(
  'incident',
  {
    id: serial('id').primaryKey().notNull(),
    date: Utils.timeStamp('date'),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({})
)
