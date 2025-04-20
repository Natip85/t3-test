import {TRPCError} from '@trpc/server'
import {env} from '@/env'

import {desc, eq, inArray, and} from 'drizzle-orm'

import {createTRPCRouter, protectedProcedure} from '@/server/api/trpc'

import {hasPermission} from '@/lib/permissions'
import {
  productOptions as optionTable,
  optionValues as optionValueTable,
  products as productTable,
  variants as variantTable,
  variantOptionValues as variantOptionTable,
  productAsset,
  variantAsset,
  assets,
} from '@/server/db/schema'
import {z} from 'zod'
import {adminProductSelectSchema, adminVariantSelectSchema} from './product-types'
import {generateSKU} from '@/lib/utils'
import {utApi} from '@/server/uploadthing'

export const productsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ctx}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    if (!hasPermission(ctx.session?.user, 'products', 'create')) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return await ctx.db.query.products.findMany({
      orderBy: desc(productTable.price),
      with: {
        variants: {
          with: {
            value: {
              with: {
                value: {with: {option: true}},
              },
            },
          },
        },
        options: {
          with: {
            values: true,
          },
        },
        assets: {with: {asset: true}},
      },
    })
  }),

  getById: protectedProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.products.findFirst({
      where: eq(productTable.id, input),
      with: {
        variants: {
          with: {
            value: {
              with: {
                value: {with: {option: true}},
              },
            },
          },
        },
        options: {
          with: {
            values: true,
          },
        },
        assets: {with: {asset: true}},
      },
    })
    return data
  }),

  createProduct: protectedProcedure.input(adminProductSelectSchema).mutation(async ({ctx, input}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    if (!hasPermission(ctx.session?.user, 'products', 'create')) {
      throw new TRPCError({code: 'FORBIDDEN'})
    }

    return ctx.db.transaction(async (tx) => {
      const {name, price, description, stockQuantity, options} = input

      const [newProduct] = await tx.insert(productTable).values({name, description, price, stockQuantity}).returning()
      if (!newProduct) {
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Product creation failed'})
      }

      if (!options || options.length === 0) {
        // No variants, just return the product
        return newProduct
      }

      const allOptionValueGroups: {optionId: number; values: {id: number; value: string}[]}[] = []

      for (const opt of options) {
        const [newOption] = await tx
          .insert(optionTable)
          .values({
            name: opt.name,
            productId: newProduct.id,
          })
          .returning()
        if (!newOption) {
          throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Option creation failed'})
        }

        const insertedValues = await tx
          .insert(optionValueTable)
          .values(
            opt.values.map((val) => ({
              value: val.value,
              optionId: newOption.id,
            }))
          )
          .returning()

        allOptionValueGroups.push({
          optionId: newOption.id,
          values: insertedValues.map((val) => {
            if (val.value === null) {
              throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Option value is null'})
            }
            return {
              id: val.id,
              value: val.value,
            }
          }),
        })
      }

      const combinations = cartesianProduct(allOptionValueGroups.map((group) => group.values))

      for (const combo of combinations) {
        const [newVariant] = await tx
          .insert(variantTable)
          .values({
            productId: newProduct.id,
            price: '1.90',
            stock: 10,
            sku: generateSKU(combo.map((v) => v.value)),
          })
          .returning()

        if (!newVariant) {
          throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Variant creation failed'})
        }

        if (combo.length > 0) {
          await tx.insert(variantOptionTable).values(
            combo.map((val) => ({
              variantId: newVariant.id,
              optionValueId: val.id,
            }))
          )
        }
      }

      return newProduct
    })
  }),

  updateProduct: protectedProcedure
    .input(adminProductSelectSchema.extend({id: z.number()}))
    .mutation(async ({ctx, input}) => {
      const user = ctx.session?.user

      if (!user) {
        throw new TRPCError({code: 'UNAUTHORIZED', message: 'User not found'})
      }

      if (!hasPermission(user, 'products', 'edit')) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have permission to edit products',
        })
      }

      return ctx.db.transaction(async (tx) => {
        const updatedProduct = await tx
          .update(productTable)
          .set({
            name: input.name,
            description: input.description,
            price: input.price,
          })
          .where(eq(productTable.id, input.id))
          .returning()

        if (!updatedProduct) {
          throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Product update failed'})
        }

        if (input.options.length === 0) {
          console.log('No options provided, deleting all options and variants')

          const existingOptions = await tx.query.productOptions.findMany({
            where: eq(optionTable.productId, input.id),
          })

          const existingOptionIds = existingOptions.map((opt) => opt.id)

          if (existingOptionIds.length > 0) {
            console.log('Deleting option values and options for option IDs:', existingOptionIds)
            await tx.delete(optionValueTable).where(inArray(optionValueTable.optionId, existingOptionIds))
            await tx.delete(optionTable).where(inArray(optionTable.id, existingOptionIds))
          }

          const existingVariants = await tx.query.variants.findMany({
            where: eq(variantTable.productId, input.id),
          })

          for (const variant of existingVariants) {
            console.log('Deleting variant SKU (no options case):', variant.sku)
            await tx.delete(variantOptionTable).where(eq(variantOptionTable.variantId, variant.id))
            await tx.delete(variantTable).where(eq(variantTable.id, variant.id))
          }

          return {success: true, productId: input.id}
        }

        const existingOptions = await tx.query.productOptions.findMany({
          where: eq(optionTable.productId, input.id),
        })
        const existingOptionIds = existingOptions.map((opt) => opt.id)

        const existingValues = await tx.query.optionValues.findMany({
          where: inArray(optionValueTable.optionId, existingOptionIds),
        })

        const inputOptionIds = input.options.map((opt) => opt.id).filter(Boolean)
        const inputValueIds = input.options.flatMap((opt) => opt.values.map((val) => val.id).filter(Boolean))

        const valueIdsToDelete = existingValues.filter((val) => !inputValueIds.includes(val.id)).map((val) => val.id)
        if (valueIdsToDelete.length > 0) {
          await tx.delete(optionValueTable).where(inArray(optionValueTable.id, valueIdsToDelete))
        }

        const optionIdsToDelete = existingOptions.filter((opt) => !inputOptionIds.includes(opt.id)).map((opt) => opt.id)
        if (optionIdsToDelete.length > 0) {
          await tx.delete(optionTable).where(inArray(optionTable.id, optionIdsToDelete))
        }

        const updatedOptionValueMap: Record<string, number> = {}

        for (const opt of input.options) {
          let currentOptionId = opt.id

          const existingOption = await tx.query.productOptions.findFirst({
            where: and(eq(optionTable.productId, input.id), eq(optionTable.id, opt.id)),
          })

          if (!existingOption) {
            const newOption = await tx
              .insert(optionTable)
              .values({
                name: opt.name,
                productId: input.id,
              })
              .returning()
              .then((res) => res[0])

            if (!newOption) {
              throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Option creation failed'})
            }

            currentOptionId = newOption.id
          } else {
            await tx.update(optionTable).set({name: opt.name}).where(eq(optionTable.id, opt.id))
          }

          for (const val of opt.values) {
            const key = `${opt.name}-${val.value}`

            const existingValue = await tx.query.optionValues.findFirst({
              where: and(eq(optionValueTable.optionId, currentOptionId), eq(optionValueTable.id, val.id)),
            })

            if (!existingValue) {
              const newValue = await tx
                .insert(optionValueTable)
                .values({
                  value: val.value,
                  optionId: currentOptionId,
                })
                .returning()
                .then((res) => res[0])

              if (newValue) {
                updatedOptionValueMap[key] = newValue.id
              }
            } else {
              await tx.update(optionValueTable).set({value: val.value}).where(eq(optionValueTable.id, val.id))
              updatedOptionValueMap[key] = val.id
            }
          }
        }

        const allOptionValueGroups = input.options.map((opt) =>
          opt.values.map((val) => {
            const key = `${opt.name}-${val.value}`
            const id = val.id || updatedOptionValueMap[key]

            if (!id) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Missing ID for option value: ${val.value}`,
              })
            }

            return {...val, id}
          })
        )

        const combinations = cartesianProduct(allOptionValueGroups)

        const existingVariants = await tx.query.variants.findMany({
          where: eq(variantTable.productId, input.id),
        })

        const existingVariantSKUs = new Set(existingVariants.map((v) => v.sku))
        const variantSKUsToKeep = new Set(combinations.map((combo) => generateSKU(combo.map((v) => v.value))))

        for (const variant of existingVariants) {
          if (!variantSKUsToKeep.has(variant.sku)) {
            await tx.delete(variantOptionTable).where(eq(variantOptionTable.variantId, variant.id))
            await tx.delete(variantTable).where(eq(variantTable.id, variant.id))
          }
        }

        for (const combo of combinations) {
          const sku = generateSKU(combo.map((v) => v.value))

          if (existingVariantSKUs.has(sku)) {
            const existingVariant = existingVariants.find((v) => v.sku === sku)

            if (existingVariant) {
              await tx.delete(variantOptionTable).where(eq(variantOptionTable.variantId, existingVariant.id))

              await tx.insert(variantOptionTable).values(
                combo.map((val) => ({
                  variantId: existingVariant.id,
                  optionValueId: val.id,
                }))
              )

              await tx
                .update(variantTable)
                .set({
                  price: input.price,
                  stock: 10,
                })
                .where(eq(variantTable.id, existingVariant.id))
            }
          } else {
            const newVariant = await tx
              .insert(variantTable)
              .values({
                productId: input.id,
                price: input.price,
                stock: 10,
                sku,
              })
              .returning()
              .then((res) => res[0])

            if (!newVariant) {
              throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Variant creation failed'})
            }

            await tx.insert(variantOptionTable).values(
              combo.map((val) => ({
                variantId: newVariant.id,
                optionValueId: val.id,
              }))
            )
          }
        }

        return {success: true, productId: input.id}
      })
    }),

  getVariants: protectedProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.variants.findMany({
      where: eq(variantTable.productId, input),
      with: {
        product: true,
        value: {with: {value: {with: {option: true}}}},
        assets: {with: {asset: true}},
      },
    })
    return data
  }),

  getVariantById: protectedProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.variants.findFirst({
      where: eq(variantTable.id, input),
      with: {
        value: {with: {value: {with: {option: true}}}},
        assets: {with: {asset: true}},
      },
    })
    return data
  }),

  editVariant: protectedProcedure.input(adminVariantSelectSchema).mutation(async ({ctx, input}) => {
    const user = ctx.session?.user

    if (!user) {
      throw new TRPCError({code: 'UNAUTHORIZED', message: 'User not found'})
    }

    if (!hasPermission(user, 'products', 'edit')) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User does not have permission to edit products',
      })
    }

    return ctx.db.transaction(async (tx) => {
      const {id, price, stock} = input
      console.log('editVariant input: ', input)

      const updatedVariant = await tx
        .update(variantTable)
        .set({
          price,
          stock,
        })
        .where(eq(variantTable.id, id))
        .returning()

      if (!updatedVariant) {
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Variant update failed'})
      }

      return updatedVariant
    })
  }),
  deleteProduct: protectedProcedure.input(z.number()).mutation(async ({ctx, input}) => {
    const user = ctx.session?.user

    if (!user) {
      throw new TRPCError({code: 'UNAUTHORIZED', message: 'User not found'})
    }

    if (!hasPermission(user, 'products', 'delete')) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User does not have permission to delete products',
      })
    }

    return ctx.db.transaction(async (tx) => {
      const product = await tx.query.products.findFirst({
        where: eq(productTable.id, input),
      })
      if (!product) {
        throw new TRPCError({code: 'NOT_FOUND', message: 'Product not found'})
      }

      // ✅ Get productAsset links and related assets
      const productAssetLinks = await tx.query.productAsset.findMany({
        where: eq(productAsset.productId, input),
      })
      const productAssetIds = productAssetLinks.map((link) => link.assetId)

      const productAssets = await tx.query.assets.findMany({
        where: inArray(assets.id, productAssetIds),
      })
      const productAssetKeys = productAssets.map((asset) => asset.url.replace(env.ASSETS_PATH_PREFIX_V0, ''))

      // ✅ Get variant asset links and related assets
      const variants = await tx.query.variants.findMany({
        where: eq(variantTable.productId, input),
      })
      const variantIds = variants.map((variant) => variant.id)

      let variantAssetIds: number[] = []
      let variantAssetKeys: string[] = []

      if (variantIds.length > 0) {
        const variantAssetLinks = await tx.query.variantAsset.findMany({
          where: inArray(variantAsset.variantId, variantIds),
        })
        variantAssetIds = variantAssetLinks.map((link) => link.assetId)

        const variantAssets = await tx.query.assets.findMany({
          where: inArray(assets.id, variantAssetIds),
        })

        variantAssetKeys = variantAssets.map((asset) => asset.url.replace(env.ASSETS_PATH_PREFIX_V0, ''))

        await tx.delete(variantAsset).where(inArray(variantAsset.variantId, variantIds))
      }

      const allAssetKeys = [...productAssetKeys, ...variantAssetKeys]

      // 🧼 Delete assets from UploadThing
      const {success} = await utApi.deleteFiles(allAssetKeys)
      if (!success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete assets from UploadThing',
        })
      }

      // ✅ Delete links in join tables
      await tx.delete(productAsset).where(eq(productAsset.productId, input))

      // ✅ Delete from assets table
      const allAssetIds = [...productAssetIds, ...variantAssetIds]
      if (allAssetIds.length > 0) {
        await tx.delete(assets).where(inArray(assets.id, allAssetIds))
      }

      // ✅ Delete product
      await tx.delete(productTable).where(eq(productTable.id, input))

      return {success: true, message: 'Product and related assets deleted successfully'}
    })
  }),
})

function cartesianProduct<T>(arr: T[][]): T[][] {
  return arr.reduce<T[][]>((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]])
}
