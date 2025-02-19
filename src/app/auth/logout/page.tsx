import {auth, signOut} from '@/server/auth'
import {redirect} from 'next/navigation'

export default async function Logout() {
  const session = await auth()

  if (session) {
    await signOut()
  }

  return redirect('/auth/login')
}
