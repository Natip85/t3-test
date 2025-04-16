'use client'
'use no memo'

import {type UseFormReturn, useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {type AdminProductSelect, adminProductSelectSchema, type Product} from './product-types'
import {formatCurrency} from '@/lib/formatters'
import {Textarea} from '@/ui/textarea'
import {api} from '@/trpc/react'
import {useRouter} from 'next/navigation'
import {Loader2, Plus, Trash2} from 'lucide-react'
import {useEffect} from 'react'
import {useToast} from '@/hooks/use-toast'
interface Props {
  product?: Product
}
export default function CreateProductForm({product}: Props) {
  const router = useRouter()
  const {toast} = useToast()
  const {mutateAsync: create, isPending: isLoading} = api.products.createProduct.useMutation()
  const {mutateAsync: update, isPending: isUpdateLoading} = api.products.updateProduct.useMutation()

  const form = useForm<AdminProductSelect>({
    resolver: zodResolver(adminProductSelectSchema),
    defaultValues: product,
  })

  async function onSubmit(values: AdminProductSelect) {
    if (product) {
      const res = await update({...values, id: product.id})
      router.push(`/admin/products/${res.productId}`)
      toast({
        title: 'Product Updated!',
        description: 'Your product was updated successfully.',
      })
    } else {
      const res = await create(values)
      router.push(`/admin/products/${res.productId}`)
    }
  }

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  })

  const addVariant = () => {
    appendVariant({
      id: 0,
      name: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      price: 0,
      stockQuantity: 0,
      productId: 0,
      sku: '',
      variantOptions: [],
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto max-w-3xl space-y-8 py-10'>
        <FormField
          control={form.control}
          name='name'
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name...' type='text' {...field} />
              </FormControl>
              <FormDescription>This is the public product name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({field}) => (
            <FormItem>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <FormControl>
                <Textarea
                  id='description'
                  {...field}
                  value={field.value ?? ''}
                  placeholder='Description'
                  className='resize-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({field}) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder='$0.00'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                />
              </FormControl>
              <FormDescription>
                The price in cents (e.g., $10.00 = 1000).
                <br />
                <span className='text-base'>{formatCurrency((form.getValues('price') || 0) / 100)}</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='stockQuantity'
          render={({field}) => (
            <FormItem>
              <FormLabel>Stock quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder='Quantity...'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {variantFields.length > 0 && <h2 className='text-xl font-bold'>Variants</h2>}
        {variantFields.map((variantField, variantIndex) => (
          <div key={variantField.id} className='relative space-y-4 rounded-md border p-4 pt-10'>
            <FormField
              control={form.control}
              name={`variants.${variantIndex}.name`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Variant Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., Color, Size' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel className='font-medium'>Variant Options</FormLabel>
              <OptionFields nestIndex={variantIndex} form={form} />
            </div>

            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => removeVariant(variantIndex)}
              className='absolute right-4 top-0'
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button type='button' onClick={addVariant}>
          <Plus /> variant
        </Button>
        <div className='pt-10'>
          <Button type='submit' disabled={isLoading || isUpdateLoading}>
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='animate-spin' /> Creating...
              </span>
            ) : isUpdateLoading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='animate-spin' /> Updating...
              </span>
            ) : product ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function OptionFields({nestIndex, form}: {nestIndex: number; form: UseFormReturn<AdminProductSelect>}) {
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: `variants.${nestIndex}.variantOptions`,
  })
  const variantName = form.watch(`variants.${nestIndex}.name`)
  useEffect(() => {
    // Get current options
    const currentOptions = form.getValues(`variants.${nestIndex}.variantOptions`) || []

    // Update each option's name to match the variant name
    currentOptions.forEach((_, optionIndex) => {
      form.setValue(`variants.${nestIndex}.variantOptions.${optionIndex}.option.name`, variantName, {
        shouldDirty: true,
      })
    })
  }, [variantName, form, nestIndex])
  return (
    <div className='space-y-2'>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className='flex gap-2'>
            <FormField
              control={form.control}
              name={`variants.${nestIndex}.variantOptions.${index}.option.id`}
              render={({field}) => (
                <FormItem className='hidden flex-grow'>
                  <FormControl>
                    <Input placeholder='Option id' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${nestIndex}.variantOptions.${index}.optionValue.value`}
              render={({field}) => (
                <FormItem className='flex-grow'>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='button' variant='outline' onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        )
      })}
      <div className='pt-5'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() =>
            append({
              option: {id: 0, name: variantName},
              optionValue: {value: ''},
            })
          }
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}
