import {eq} from 'drizzle-orm'
import {z} from 'zod'
import {db} from '..'
import {assets, productAsset, users, variantAsset} from '../schema'
import {type UploadedFileData} from 'uploadthing/types'

export const updateUserProfileImageProps = z.object({
  image: z.string(),
  userId: z.string(),
})

export const updateUserProfileImage = async (input: z.infer<typeof updateUserProfileImageProps>) => {
  return db
    .update(users)
    .set({image: input.image})
    .where(eq(users.id, input.userId))
    .returning({id: users.id, image: users.image})
}

export const insertProductImageProps = z.object({
  url: z.string(),
  productId: z.number(),
  userId: z.string(),
  type: z.enum(['image', 'video']),
  fileInfo: z.record(z.string(), z.string()).or(z.unknown()).optional(),
})
export const insertVariantImageProps = z.object({
  url: z.string(),
  variantId: z.number(),
  userId: z.string(),
  type: z.enum(['image', 'video']),
  fileInfo: z.record(z.string(), z.string()).or(z.unknown()).optional(),
})

export const insertProductImage = async (input: z.infer<typeof insertProductImageProps>) => {
  return db.transaction(async (tx) => {
    const [asset] = await tx
      .insert(assets)
      .values({
        url: input.url,
        createdByUserId: input.userId,
        type: input.type,
        fileInfo: input.fileInfo as Partial<UploadedFileData>,
      })
      .returning({assetId: assets.id})

    if (!asset) {
      tx.rollback()
      throw new Error('Failed to insert product images')
    }

    await tx.insert(productAsset).values({
      assetId: asset.assetId,
      productId: input.productId,
    })

    return asset
  })
}

export const insertVariantImage = async (input: z.infer<typeof insertVariantImageProps>) => {
  return db.transaction(async (tx) => {
    const [asset] = await tx
      .insert(assets)
      .values({
        url: input.url,
        createdByUserId: input.userId,
        type: input.type,
        fileInfo: input.fileInfo as Partial<UploadedFileData>,
      })
      .returning({assetId: assets.id})

    if (!asset) {
      tx.rollback()
      throw new Error('Failed to insert variant images')
    }

    await tx.insert(variantAsset).values({
      assetId: asset.assetId,
      variantId: input.variantId,
    })

    return asset
  })
}
