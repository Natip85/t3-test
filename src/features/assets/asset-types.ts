import {createSelectSchema} from 'drizzle-zod'
import {z} from 'zod'
import type {UploadedFileData} from 'uploadthing/types'
import {assets} from '@/server/db/schema/asset-schema'

export const assetSelectSchema = createSelectSchema(assets).extend({
  fileInfo: z.record(z.string(), z.string()).or(z.unknown()).optional(),
})
export type AssetSelect = z.infer<typeof assetSelectSchema>

export type AssetFileInfo = Partial<UploadedFileData>
