import {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {option, optionValue, product, variant} from '@/server/db/schema'
import {type RouterOutputs} from '@/trpc/react'

export const productInsertSchema = createInsertSchema(product)
export type ProductInsert = z.infer<typeof productInsertSchema>

export const productSelectSchema = createSelectSchema(product)
export type ProductSelect = z.infer<typeof productSelectSchema>

export const variantSelectSchema = createSelectSchema(variant)
export type VariantSelect = z.infer<typeof variantSelectSchema>

export const optionSelectSchema = createSelectSchema(option)
export type OptionSelect = z.infer<typeof optionSelectSchema>

export const optionValueSelectSchema = createSelectSchema(optionValue)
export type OptionValueSelect = z.infer<typeof optionValueSelectSchema>

export const adminProductSelectSchema = createSelectSchema(product)
  .omit({id: true, imageUrl: true, createdAt: true, updatedAt: true})
  .extend({
    variants: z.array(
      variantSelectSchema.extend({
        name: z.string().min(1, 'Variant name cannot be empty'),
        variantOptions: z.array(
          optionValueSelectSchema.omit({id: true, optionId: true, value: true}).extend({
            option: optionSelectSchema.optional(),
            optionValue: optionValueSelectSchema.omit({optionId: true}).extend({
              value: z.string().min(1, 'Option value cannot be empty'),
            }),
          })
        ),
      })
    ),
  })
export type AdminProductSelect = z.infer<typeof adminProductSelectSchema>

export type Product = NonNullable<RouterOutputs['products']['getById']>
