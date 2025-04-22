'use client'
'use no memo'

import {type UseFormReturn, useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {type AdminProductSelect, adminProductSelectSchema, type Product, type Variant} from './product-types'
import {formatCurrency} from '@/lib/formatters'
import {Textarea} from '@/ui/textarea'
import {api} from '@/trpc/react'
import {useRouter} from 'next/navigation'
import {ArrowLeft, Loader2, Plus, Trash2, X} from 'lucide-react'
import {useToast} from '@/hooks/use-toast'
import VariantOptionsTable from './variants-options-table'
import {ProductImageInput} from './product-image-input'
import Image from 'next/image'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/ui/select'
interface Props {
  product?: Product
  variants?: Variant[]
}
export default function CreateProductForm({product, variants}: Props) {
  const router = useRouter()
  const {toast} = useToast()
  const {mutateAsync: create, isPending: isLoading} = api.products.createProduct.useMutation()
  const {mutateAsync: update, isPending: isUpdateLoading} = api.products.updateProduct.useMutation()
  const {mutateAsync: deleteAsset, isPending: isDeleting} = api.assets.deleteAsset.useMutation()
  const {mutateAsync: deleteProduct, isPending: isProductDeleting} = api.products.deleteProduct.useMutation()

  const form = useForm<AdminProductSelect>({
    resolver: zodResolver(adminProductSelectSchema),
    defaultValues: product || {active: 'draft'},
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
      router.push(`/admin/products/${res.id}`)
      toast({
        title: 'Product Created!',
        description: 'Your product was created successfully.',
      })
    }
  }

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  const addVariant = () => {
    appendOption({
      id: 0,
      name: '',
      productId: product?.id || null,
      values: [],
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

  const handleDeleteProduct = async (productId: number | undefined) => {
    if (!productId) return
    await deleteProduct(productId).catch((err) => {
      console.error('Error deleting product', err)
    })
    router.push('/admin/products')
    toast({
      title: ' Product deleted',
      description: `The product was deleted successfully`,
    })
  }
  console.log('watch', form.watch())
  console.log('errors', form.formState.errors)

  return (
    <div>
      <div className='mx-auto mb-10 flex max-w-5xl items-center gap-3'>
        <Button type='button' size={'sm'} variant={'ghost'} onClick={() => router.push('/admin/products')}>
          <ArrowLeft />
        </Button>
        <h2 className='text-2xl md:text-4xl'> {product ? product.name : 'Add product'}</h2>
      </div>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mx-auto flex max-w-5xl flex-col-reverse gap-8 lg:flex-row'
          >
            <div className='flex-1 space-y-4'>
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
              {product && (
                <>
                  <h2 className='text-xl font-bold'>Media</h2>
                  <div className='grid grid-cols-2 gap-3 xl:grid-cols-3'>
                    {product?.assets.map((ass) => (
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

                    <ProductImageInput productId={product?.id ?? 0} uploadImage={() => router.refresh()} />
                  </div>
                </>
              )}

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
                      <br />
                      <span>Any changes made here will reflect on all variants</span>
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
                    <FormDescription>Any changes made here will reflect on all variants</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {optionFields.length > 0 && <h2 className='text-xl font-bold'>Variants</h2>}
              {optionFields.map((optionField, optionIndex) => (
                <div key={optionField.id} className='relative space-y-4 rounded-md border p-4 pt-10'>
                  <FormField
                    control={form.control}
                    name={`options.${optionIndex}.name`}
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
                    <OptionFields nestIndex={optionIndex} form={form} product={product} />
                  </div>

                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => removeOption(optionIndex)}
                    className='absolute right-4 top-0'
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button type='button' onClick={addVariant}>
                <Plus /> variant
              </Button>

              {product && <VariantOptionsTable product={product} variants={variants} />}

              <div className='flex justify-end gap-3 pt-10'>
                {product && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type='button' variant={'destructive'}>
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will delete the product and all its variants.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className='gap-3'>
                        <DialogClose asChild>
                          <Button
                            disabled={isProductDeleting}
                            variant='destructive'
                            type='button'
                            onClick={() => handleDeleteProduct(product?.id)}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                        <DialogClose type='button' asChild>
                          <Button type='button'>Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Button type='submit' disabled={isLoading || isUpdateLoading || !form.formState.isDirty}>
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
            </div>
            <div className='w-full lg:w-1/4'>
              <FormField
                control={form.control}
                name='active'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a verified email to display' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'active'}>Active</SelectItem>
                        <SelectItem value={'draft'}>Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

function OptionFields({
  product,
  nestIndex,
  form,
}: {
  product?: Product
  nestIndex: number
  form: UseFormReturn<AdminProductSelect>
}) {
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: `options.${nestIndex}.values`,
  })
  return (
    <div className='space-y-2'>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className='flex gap-2'>
            <FormField
              control={form.control}
              name={`options.${nestIndex}.values.${index}.value`}
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
              name={`options.${nestIndex}.values.${index}.value`}
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
              id: 0,
              value: '',
              optionId: product?.id || null,
            })
          }
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}
