import {auth} from '@/server/auth'
import {createUploadthing, type FileRouter} from 'uploadthing/next'
import {UploadThingError} from 'uploadthing/server'
import {updateUserProfileImage} from '@/server/db/queries/asset-queries'
import {env} from '@/env'
import {api} from '@/trpc/server'
import {utApi} from '@/server/uploadthing'

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
  // incidentImage: f({
  //   image: {
  //     maxFileSize: '4MB',
  //     maxFileCount: 1,
  //   },
  //   video: {
  //     maxFileSize: '128MB',
  //     maxFileCount: 1,
  //   },
  // })
  //   .input(z.object({incidentId: z.number()}))
  //   .middleware(async ({input}) => {
  //     const [session, user] = await Promise.allSettled([auth(), api.users.getMe()])

  //     if (session.status === 'rejected' || user.status === 'rejected' || !session.value?.user) {
  //       throw new UploadThingError('Unauthorized')
  //     }

  //     return {userId: session.value.user.id, incidentId: input.incidentId}
  //   })
  //   .onUploadComplete(async ({metadata, file}) => {
  //     console.log('Upload complete for incidentId:', metadata.incidentId)
  //     const url = `${env.ASSETS_PATH_PREFIX_V0}${file.key}`
  //     const fileType = (file.type.split('/')[0] as 'image' | 'video') ?? ''
  //     if (!['image', 'video'].includes(fileType)) {
  //       console.error('Invalid file type', {metadata, file})
  //       // TODO: delete the file from the bucket
  //       throw new UploadThingError('Invalid file type')
  //     }

  //     if (!metadata.incidentId) {
  //       console.error('Incident ID is required', {metadata, file})
  //       // TODO: delete the file from the bucket
  //       throw new UploadThingError('Incident ID is required')
  //     }

  //     if (!metadata.userId) {
  //       console.error('User ID is required', {metadata, file})
  //       // TODO: delete the file from the bucket
  //       throw new UploadThingError('User ID is required')
  //     }

  //     const {assetId} = await insertIncidentImage({
  //       url,
  //       incidentId: metadata.incidentId,
  //       userId: metadata.userId,
  //       type: fileType,
  //       fileInfo: {
  //         fileName: file.name,
  //         fileType: file.type,
  //         fileSize: file.size,
  //       },
  //     })

  //     return {imageUrl: url, assetId}
  //   }),
}

export type OurFileRouter = typeof ourFileRouter
