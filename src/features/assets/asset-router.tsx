import {TRPCError} from '@trpc/server'
import {eq} from 'drizzle-orm'
import {z} from 'zod'

// import {hasPermission} from '@/lib/permissions'
import {createTRPCRouter, protectedProcedure} from '@/server/api/trpc'
import {env} from '@/env'
import {utApi} from '@/server/uploadthing'
import {assets} from '@/server/db/schema/asset-schema'
export const assetsRouter = createTRPCRouter({
  deleteAsset: protectedProcedure.input(z.object({assetId: z.number()})).mutation(async ({ctx, input}) => {
    const {user} = ctx.session
    if (!user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return await ctx.db.transaction(async (tx) => {
      const asset = await tx.query.assets.findFirst({
        where: (assets, {eq}) => eq(assets.id, input.assetId),
      })
      if (!asset?.url) {
        tx.rollback()
        return
      }
      // if (!asset?.url || !hasPermission(user, 'assets', 'delete', asset)) {
      //   tx.rollback()
      //   return
      // }

      const {success} = await utApi.deleteFiles(asset.url.replace(env.ASSETS_PATH_PREFIX_V0, ''))
      if (!success) {
        tx.rollback()
        return
      }

      const [deletedAsset] = await tx.delete(assets).where(eq(assets.id, input.assetId)).returning()
      return deletedAsset
    })
  }),
  updateOriginalUrl: protectedProcedure
    .input(
      z.object({
        originalUrl: z.string(),
        id: z.number(),
      })
    )
    .mutation(async ({ctx, input: {id, originalUrl}}) => {
      const {user} = ctx.session
      if (!user) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
      }

      return await ctx.db.transaction(async (tx) => {
        const asset = await tx.query.assets.findFirst({
          where: (assets, {eq}) => eq(assets.id, id),
        })
        // if (!asset || !hasPermission(user, 'assets', 'edit', asset)) {
        //   tx.rollback()
        // }

        const [updatedAsset] = await tx
          .update(assets)
          .set({
            originalUrl,
          })
          .where(eq(assets.id, id))
          .returning()

        return updatedAsset
      })
    }),
})
