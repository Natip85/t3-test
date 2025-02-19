import {eq} from 'drizzle-orm'
import {z} from 'zod'
import {db} from '..'
import {users} from '../schema'

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

// export const insertIncidentImageProps = z.object({
//   url: z.string(),
//   incidentId: z.number(),
//   userId: z.string(),
//   type: z.enum(['image', 'video']),
//   fileInfo: z.record(z.string(), z.string()).or(z.unknown()).optional(),
// })

// export const insertIncidentImage = async (input: z.infer<typeof insertIncidentImageProps>) => {
//   return db.transaction(async (tx) => {
//     const [asset] = await tx
//       .insert(assets)
//       .values({
//         url: input.url,
//         createdByUserId: input.userId,
//         type: input.type,
//         fileInfo: input.fileInfo,
//       })
//       .returning({assetId: assets.id})

//     if (!asset) {
//       tx.rollback()
//       throw new Error('Failed to insert incident images')
//     }

//     await tx.insert(incidentAsset).values({
//       assetId: asset.assetId,
//       incidentId: input.incidentId,
//     })

//     return asset
//   })
// }
