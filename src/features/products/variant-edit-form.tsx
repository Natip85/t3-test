'use client'
'use no memo'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {type AdminVariantSelect, type Variant, adminVariantSelectSchema} from './product-types'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/ui/form'
import {Input} from '@/ui/input'
import {formatCurrency} from '@/lib/formatters'
import {Button} from '@/ui/button'
import {api} from '@/trpc/react'
import {toast} from '@/hooks/use-toast'
import {useRouter} from 'next/navigation'
import {Loader2, X} from 'lucide-react'
import {VariantImageInput} from './variant-image-input'
import Image from 'next/image'
interface Props {
  variant?: Variant
}
export default function VariantEditForm({variant}: Props) {
  const router = useRouter()
  const {mutateAsync: update, isPending: isUpdateLoading} = api.products.editVariant.useMutation()
  const {mutateAsync: deleteAsset, isPending: isDeleting} = api.assets.deleteAsset.useMutation()

  const form = useForm<AdminVariantSelect>({
    resolver: zodResolver(adminVariantSelectSchema),
    defaultValues: variant,
  })

  async function onSubmit(values: AdminVariantSelect) {
    await update(values)
    router.refresh()
    toast({
      title: 'Success',
      description: 'Variant updated successfully',
    })
  }
  const doDeleteAsset = async (assetId: number) => {
    await deleteAsset({assetId}).catch((err) => {
      console.error('Error deleting asset', err)
    })
    router.refresh()
    toast({
      title: 'Media deleted',
      description: `The media was deleted successfully`,
    })
  }
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
                    <Input disabled {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
        <div className='grid grid-cols-2 gap-3 xl:grid-cols-3'>
          {variant?.assets.map((ass) => (
            <div key={ass.id} className='relative aspect-square size-full'>
              {isDeleting ? (
                <Loader2 className='absolute right-2 top-2 z-50 animate-spin text-destructive' />
              ) : (
                <X
                  onClick={() => void doDeleteAsset(ass.asset.id)}
                  className='absolute right-2 top-2 z-50 border bg-destructive/20 text-destructive shadow-md transition-colors hover:cursor-pointer hover:bg-destructive/40'
                />
              )}

              <Image src={ass.asset.fileInfo?.url ?? ''} fill alt='prod img' className='rounded-md' />
            </div>
          ))}
          <VariantImageInput variantId={variant?.id ?? 0} uploadImage={() => router.refresh()} />
        </div>
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
          <Button type='submit' disabled={isUpdateLoading || !form.formState.isDirty}>
            {isUpdateLoading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='animate-spin' /> Updating...
              </span>
            ) : (
              <span>Update</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
