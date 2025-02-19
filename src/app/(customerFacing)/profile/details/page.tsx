// import ProfileEditForm from '@/features/auth/profile-edit-form'
import ProfileEditForm from '@/features/auth/profile-edit-form'
import ProfileMenu from '@/features/navigation/profile-menu'
import {api} from '@/trpc/server'
import {redirect} from 'next/navigation'

export default async function ProfileDetailsPage() {
  const user = await api.users.getMe()
  console.log({user})
  console.log({user})

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className='flex-1 justify-between gap-4 p-2 md:flex md:p-10'>
      <ProfileMenu />
      <ProfileEditForm user={user} />
    </div>
  )
}
