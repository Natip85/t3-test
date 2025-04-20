import {UploadDropzone, type ProductImageUploadResponse} from '@/lib/uploadthing'

type Props = {
  productId: number
  uploadImage: (image: ProductImageUploadResponse) => void
}

export const ProductImageInput = ({productId, uploadImage}: Props) => {
  return (
    <UploadDropzone
      className='mt-0 w-full cursor-pointer rounded-md border border-dashed border-secondary ut-label:text-primary'
      endpoint='productImage'
      // @ts-expect-error I'm not sure why the types are wrong
      input={{productId}}
      config={{
        mode: 'auto',
      }}
      onClientUploadComplete={async (res: ProductImageUploadResponse) => {
        console.log('upload complete', res)
        uploadImage(res)
      }}
      onUploadError={(error: Error) => {
        console.log('upload error', error)
      }}
      appearance={{
        button:
          'ut-ready:bg-primary ut-ready:font-button ut-ready:text-xl ut-ready:text-black ut-uploading:cursor-not-allowed bg-red-500 bg-none after:bg-green-700',
      }}
    />
  )
}
