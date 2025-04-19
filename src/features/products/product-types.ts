import {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {type RouterOutputs} from '@/trpc/react'
import {optionValues, productOptions, products, variantOptionValues, variants} from '@/server/db/schema'

export const productInsertSchema = createInsertSchema(products)
export type ProductInsert = z.infer<typeof productInsertSchema>

export const productSelectSchema = createSelectSchema(products)
export type ProductSelect = z.infer<typeof productSelectSchema>

export const variantSelectSchema = createSelectSchema(variants)
export type VariantSelect = z.infer<typeof variantSelectSchema>

export const optionSelectSchema = createSelectSchema(productOptions)
export type OptionSelect = z.infer<typeof optionSelectSchema>

export const optionValueSelectSchema = createSelectSchema(optionValues)
export type OptionValueSelect = z.infer<typeof optionValueSelectSchema>

export const variantOptionValuesSelectSchema = createSelectSchema(variantOptionValues)
export type VariantOptionValuesSelect = z.infer<typeof variantOptionValuesSelectSchema>

export const adminProductSelectSchema = createSelectSchema(products)
  .omit({id: true, createdAt: true})
  .extend({
    options: z.array(
      optionSelectSchema.extend({
        values: z.array(
          optionValueSelectSchema.extend({
            value: z.string().min(1, 'Option value cannot be empty'),
          })
        ),
      })
    ),
  })
export type AdminProductSelect = z.infer<typeof adminProductSelectSchema>

export const adminVariantSelectSchema = createSelectSchema(variants).extend({
  value: z.array(
    optionValueSelectSchema.omit({optionId: true}).extend({
      value: variantOptionValuesSelectSchema
        .omit({optionValueId: true, variantId: true})
        .extend({
          value: z.string().min(1, 'Option value cannot be empty'),
          option: optionSelectSchema,
        })
        .nullable(),
    })
  ),
})

export type AdminVariantSelect = z.infer<typeof adminVariantSelectSchema>

export type Product = NonNullable<RouterOutputs['products']['getById']>
export type Variant = NonNullable<RouterOutputs['products']['getVariantById']>
export type Variants = NonNullable<RouterOutputs['products']['getVariants']>
