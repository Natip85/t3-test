'use client'
'use no memo'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {type AdminVariantSelect, type Variant, adminVariantSelectSchema} from './product-types'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/ui/form'
import {Input} from '@/ui/input'
import {formatCurrency} from '@/lib/formatters'
import {Button} from '@/ui/button'
interface Props {
  variant?: Variant
}
export default function VariantEditForm({variant}: Props) {
  console.log('variant: ', variant)

  const form = useForm<AdminVariantSelect>({
    resolver: zodResolver(adminVariantSelectSchema),
    defaultValues: variant,
  })

  async function onSubmit(values: AdminVariantSelect) {
    console.log('values: ', values)
  }
  console.log('watch:', form.watch())
  console.log('errors:', form.formState.errors)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 rounded-md border p-2 py-10'>
        {variant?.value.map((value, i) => {
          return (
            <FormField
              key={value.id}
              control={form.control}
              name={`value.${i}.value.value`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>{form.getValues(`value.${i}.value.option.name`)}</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
        <FormField
          control={form.control}
          name='price'
          render={({field}) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder='$0.00' {...field} onChange={(e) => field.onChange(e.target.value)} />
              </FormControl>
              <FormDescription>
                The price in cents (e.g., $10.00 = 1000).
                <br />
                <span className='text-base'>{formatCurrency(form.getValues('price') || 0)}</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='stock'
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
        <div>
          <Button>Submit</Button>
        </div>
      </form>
    </Form>
  )
}
