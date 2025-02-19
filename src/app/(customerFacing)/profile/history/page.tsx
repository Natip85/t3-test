import ProfileMenu from '@/features/navigation/profile-menu'

export default async function HistoryPage() {
  return (
    <div className='flex-1 justify-between gap-4 p-2 md:flex md:p-10'>
      <ProfileMenu />
      history table here
    </div>
  )
}
