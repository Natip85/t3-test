import {TRPCError} from '@trpc/server'
import {desc, eq, inArray, and, not} from 'drizzle-orm'

import {createTRPCRouter, protectedProcedure} from '@/server/api/trpc'

import {hasPermission} from '@/lib/permissions'
import {
  option as optionTable,
  optionValue as optionValueTable,
  product as productTable,
  variant as variantTable,
  variantOption as variantOptionTable,
} from '@/server/db/schema'
import {z} from 'zod'
import {adminProductSelectSchema} from './product-types'
import {v4 as uuidv4} from 'uuid'

export const productsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ctx}) => {
    if (!ctx.session?.user) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    if (!hasPermission(ctx.session?.user, 'products', 'create')) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }

    return await ctx.db.query.product.findMany({
      orderBy: desc(productTable.price),
      with: {variants: {with: {variantOptions: {with: {option: true, optionValue: true}}}}},
    })
  }),
  getById: protectedProcedure.input(z.number()).query(async ({ctx, input}) => {
    const data = await ctx.db.query.product.findFirst({
      where: eq(productTable.id, input),
      with: {
        variants: {
          with: {
            variantOptions: {
              columns: {
                variantId: false,
                optionId: false,
                optionValueId: false,
              },
              with: {
                option: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
                optionValue: {
                  columns: {
                    id: true,
                    value: true,
                  },
                },
              },
            },
          },
        },
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
      // // Create the product
      const [newProduct] = await tx
        .insert(productTable)
        .values({
          name: input.name,
          description: input.description,
          price: input.price,
          stockQuantity: input.stockQuantity,
        })
        .returning()

      if (!newProduct) {
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create product'})
      }

      // Handle variants if provided
      if (input.variants && input.variants.length > 0) {
        for (const v of input.variants) {
          const sku = `PROD-${uuidv4()}`

          const [newVariant] = await tx
            .insert(variantTable)
            .values({
              productId: newProduct.id,
              name: v.name,
              sku,
              price: input.price,
              stockQuantity: input.stockQuantity,
            })
            .returning()

          if (!newVariant) {
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create variant'})
          }

          // Create an option entry if it doesn't exist
          const [newOption] = await tx.insert(optionTable).values({name: v.name}).returning()

          if (!newOption) {
            tx.rollback()
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create option'})
          }

          if (v.variantOptions && v.variantOptions.length > 0) {
            const newOptionValues = await tx
              .insert(optionValueTable)
              .values(
                v.variantOptions.map((o) => ({
                  value: o.optionValue.value,
                  optionId: newOption.id,
                }))
              )
              .returning()
            await tx.insert(variantOptionTable).values(
              newOptionValues.map((ov) => ({
                variantId: newVariant.id,
                optionId: newOption.id,
                optionValueId: ov.id,
              }))
            )
          }
        }
      }

      return {success: true, productId: newProduct.id}
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
        // Update the main product
        await tx
          .update(productTable)
          .set({
            name: input.name,
            description: input.description,
            price: input.price,
            stockQuantity: input.stockQuantity,
          })
          .where(eq(productTable.id, input.id))

        const inputVariantIds = input.variants.map((v) => v.id).filter(Boolean)

        // Delete removed variants
        await tx
          .delete(variantTable)
          .where(and(eq(variantTable.productId, input.id), not(inArray(variantTable.id, inputVariantIds))))

        // Handle each variant
        for (const variant of input.variants) {
          let variantId = variant.id

          if (variant.id) {
            // Update existing variant
            await tx.update(variantTable).set({name: variant.name}).where(eq(variantTable.id, variant.id))
          } else {
            // Insert new variant
            const sku = `PROD-${uuidv4()}`

            const [newVariant] = await tx
              .insert(variantTable)
              .values({
                price: variant.price,
                stockQuantity: variant.stockQuantity,
                sku,
                name: variant.name,
                productId: input.id,
              })
              .returning()

            if (!newVariant) {
              tx.rollback()
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to insert new variant',
              })
            }

            variantId = newVariant.id
          }

          // Remove old variant options for this variant
          await tx.delete(variantOptionTable).where(eq(variantOptionTable.variantId, variantId))

          // Reinsert variant options and values
          for (const variantOption of variant.variantOptions) {
            const [newOption] = await tx.insert(optionTable).values({name: variantOption.option!.name}).returning()

            if (!newOption) {
              tx.rollback()
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create option',
              })
            }
            type OptionValue = {value: string}

            const newOptionValues = await tx
              .insert(optionValueTable)
              .values(
                Array.isArray(variantOption.optionValue)
                  ? (variantOption.optionValue as OptionValue[]).map((ov) => ({
                      value: ov.value,
                      optionId: newOption.id,
                    }))
                  : [
                      {
                        value: (variantOption.optionValue as OptionValue).value,
                        optionId: newOption.id,
                      },
                    ]
              )
              .returning()

            await tx.insert(variantOptionTable).values(
              newOptionValues.map((ov) => ({
                variantId,
                optionId: newOption.id,
                optionValueId: ov.id,
              }))
            )
          }
        }

        // Clean up orphaned option values and options
        const remainingVariantIds = (
          await tx.select({id: variantTable.id}).from(variantTable).where(eq(variantTable.productId, input.id))
        ).map((v) => v.id)

        const usedOptionValueIds = (
          await tx
            .select({optionValueId: variantOptionTable.optionValueId})
            .from(variantOptionTable)
            .where(inArray(variantOptionTable.variantId, remainingVariantIds))
        ).map((row) => row.optionValueId)

        await tx.delete(optionValueTable).where(not(inArray(optionValueTable.id, usedOptionValueIds)))

        const usedOptionIds = (
          await tx
            .select({optionId: variantOptionTable.optionId})
            .from(variantOptionTable)
            .where(inArray(variantOptionTable.variantId, remainingVariantIds))
        ).map((row) => row.optionId)

        await tx.delete(optionTable).where(not(inArray(optionTable.id, usedOptionIds)))

        return {success: true, productId: input.id}
      })
    }),
})
