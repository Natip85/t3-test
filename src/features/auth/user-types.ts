import {type z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {users} from '@/server/db/schema'

export const userInsertSchema = createInsertSchema(users)
export const userSelectSchema = createSelectSchema(users)

export type UserInsert = z.infer<typeof userInsertSchema>
export type UserSelect = z.infer<typeof userSelectSchema>

export const userProfileFormSchema = userSelectSchema.pick({
  id: true,
  name: true,
  email: true,
  image: true,
  language: true,
  phone: true,
  roles: true,
})

export type UserProfileForm = z.infer<typeof userProfileFormSchema>
