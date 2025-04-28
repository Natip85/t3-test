import {type z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {type RouterOutputs} from '@/trpc/react'
import {order} from '@/server/db/schema'

export const orderInsertSchema = createInsertSchema(order)
export type OrderInsert = z.infer<typeof orderInsertSchema>

export const orderSelectSchema = createSelectSchema(order)
export type OrderSelect = z.infer<typeof orderSelectSchema>

export type Order = NonNullable<RouterOutputs['orders']['getByIntentId']>
