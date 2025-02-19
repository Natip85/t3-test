import {AvatarFallback} from '@/ui/avatar'
import {useUser} from '@/hooks/use-user'
import {AvatarImage} from '@/ui/avatar'
import {Avatar} from '@/ui/avatar'
import {User2} from 'lucide-react'
import {type ProfileImageUploadResponse, UploadButton} from '@/lib/uploadthing'

export const ProfileImageInput = () => {
  const {user, update, refetch} = useUser()

  return (
    <UploadButton
      className='ut-button:h-20 ut-button:w-20 ut-button:rounded-full ut-button:bg-transparent w-min'
      endpoint='profileImage'
      onClientUploadComplete={async (res: ProfileImageUploadResponse) => {
        console.log('upload complete', res)
        const image = res[0]?.serverData?.imageUrl
        if (image) {
          await update({image})
        } else {
          await refetch()
        }
      }}
      onUploadError={(error: Error) => {
        console.log('upload error', error)
      }}
      content={{
        button: () => (
          <Avatar className='h-20 w-20 cursor-pointer overflow-hidden'>
            {user?.image && <AvatarImage size={80} src={user.image} alt={`${user.name} avatar`} />}
            <AvatarFallback className='bg-primary'>
              <User2 className='h-12 w-12 stroke-black' />
            </AvatarFallback>
          </Avatar>
        ),
      }}
    />
  )
}
