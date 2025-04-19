import {auth} from '@/server/auth'
import {createUploadthing, type FileRouter} from 'uploadthing/next'
import {UploadThingError} from 'uploadthing/server'
import {insertProductImage, insertVariantImage, updateUserProfileImage} from '@/server/db/queries/asset-queries'
import {env} from '@/env'
import {api} from '@/trpc/server'
import {utApi} from '@/server/uploadthing'
import {z} from 'zod'

const f = createUploadthing()

export const ourFileRouter: FileRouter = {
  profileImage: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const [session, user] = await Promise.allSettled([auth(), api.users.getMe()])

      if (session.status === 'rejected' || user.status === 'rejected' || !session.value?.user) {
        throw new UploadThingError('Unauthorized')
      }

      return {
        userId: session.value.user.id,
        originalImageUrl: user.value?.image,
      }
    })
    .onUploadComplete(async ({metadata, file}) => {
      console.log({file})
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId)
      const image = `${env.ASSETS_PATH_PREFIX_V0}${file.key}`
      const updated = await updateUserProfileImage({
        image,
        userId: metadata.userId,
      })
      console.log('updated', updated)

      if (metadata.originalImageUrl) {
        console.log('deleting original', metadata.originalImageUrl)
        const deleteOriginal = await utApi.deleteFiles([
          metadata.originalImageUrl?.replace(env.ASSETS_PATH_PREFIX_V0, ''),
        ])
        console.log('deleted original', deleteOriginal)
      }

      console.log('file url', file.url)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {uploadedBy: metadata.userId, imageUrl: image}
    }),
  productImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .input(z.object({productId: z.number()}))
    .middleware(async ({input}) => {
      const [session, user] = await Promise.allSettled([auth(), api.users.getMe()])

      if (session.status === 'rejected' || user.status === 'rejected' || !session.value?.user) {
        throw new UploadThingError('Unauthorized')
      }

      return {userId: session.value.user.id, productId: input.productId}
    })
    .onUploadComplete(async ({metadata, file}) => {
      console.log('Upload complete for productId:', metadata.productId)
      const url = `${env.ASSETS_PATH_PREFIX_V0}${file.key}`
      const fileType = (file.type.split('/')[0] as 'image' | 'video') ?? ''
      if (!['image', 'video'].includes(fileType)) {
        console.error('Invalid file type', {metadata, file})
        // TODO: delete the file from the bucket
        throw new UploadThingError('Invalid file type')
      }

      if (!metadata.productId) {
        console.error('Product ID is required', {metadata, file})
        // TODO: delete the file from the bucket
        throw new UploadThingError('Product ID is required')
      }

      if (!metadata.userId) {
        console.error('User ID is required', {metadata, file})
        // TODO: delete the file from the bucket
        throw new UploadThingError('User ID is required')
      }

      const {assetId} = await insertProductImage({
        url,
        productId: metadata.productId,
        userId: metadata.userId,
        type: fileType,
        fileInfo: {...file},
      })

      return {imageUrl: url, assetId}
    }),
  variantImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .input(z.object({variantId: z.number()}))
    .middleware(async ({input}) => {
      const [session, user] = await Promise.allSettled([auth(), api.users.getMe()])

      if (session.status === 'rejected' || user.status === 'rejected' || !session.value?.user) {
        throw new UploadThingError('Unauthorized')
      }

      return {userId: session.value.user.id, variantId: input.variantId}
    })
    .onUploadComplete(async ({metadata, file}) => {
      console.log('Upload complete for variantId:', metadata.variantId)
      const url = `${env.ASSETS_PATH_PREFIX_V0}${file.key}`
      const fileType = (file.type.split('/')[0] as 'image' | 'video') ?? ''
      if (!['image', 'video'].includes(fileType)) {
        console.error('Invalid file type', {metadata, file})
        // TODO: delete the file from the bucket
        throw new UploadThingError('Invalid file type')
      }

      if (!metadata.variantId) {
        console.error('Variant ID is required', {metadata, file})
        // TODO: delete the file from the bucket
        throw new UploadThingError('Variant ID is required')
      }

      if (!metadata.userId) {
        console.error('User ID is required', {metadata, file})
        // TODO: delete the file from the bucket
        throw new UploadThingError('User ID is required')
      }

      const {assetId} = await insertVariantImage({
        url,
        variantId: metadata.variantId,
        userId: metadata.userId,
        type: fileType,
        fileInfo: {...file},
      })

      return {imageUrl: url, assetId}
    }),
}

export type OurFileRouter = typeof ourFileRouter
