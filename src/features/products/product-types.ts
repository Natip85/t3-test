import {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {type RouterOutputs} from '@/trpc/react'
import {optionValues, productOptions, products, variants} from '@/server/db/schema'

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

// export const adminProductSelectSchema = createSelectSchema(products)
//   .omit({id: true, createdAt: true})
//   .extend({
//     variants: z.array(
//       variantSelectSchema.extend({
//         name: z.string().min(1, 'Variant name cannot be empty'),
//         variantOptions: z.array(
//           optionValueSelectSchema.extend({
//             option: optionSelectSchema,
//             optionValue: optionValueSelectSchema.extend({
//               value: z.string().min(1, 'Option value cannot be empty'),
//             }),
//           })
//         ),
//       })
//     ),
//   })
// export type AdminProductSelect = z.infer<typeof adminProductSelectSchema>
export const adminProductSelectSchema = createSelectSchema(products)
  .omit({id: true, createdAt: true})
  .extend({
    // variants: z.array(variantSelectSchema),
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

export type Product = NonNullable<RouterOutputs['products']['getById']>
