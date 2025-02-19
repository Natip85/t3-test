'use client'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/ui/form'
import {Input} from '@/ui/input'
import {useUser} from '@/hooks/use-user'
import {api} from '@/trpc/react'
import {PhoneInput} from '@/ui/phone-input'
import {hasPermission, hasRole} from '@/lib/permissions'
import {cn} from '@/lib/utils'
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from '@/ui/select'
import {Button} from '@/ui/button'
import {useToast} from '@/hooks/use-toast'
import {Checkbox} from '@/ui/checkbox'

import {type UserProfileForm, userProfileFormSchema} from './user-types'
import {type UserLanguage, UserRoles} from '@/server/db/schema'
import {ProfileImageInput} from './profile-image-input'

const languages: {label: string; value: UserLanguage}[] = [
  {label: 'English', value: 'en'},
  {label: 'French', value: 'fr'},
]

interface ProfileEditFormProps {
  user: UserProfileForm
  onSuccess?: () => void
}

export default function ProfileEditForm({user, onSuccess}: ProfileEditFormProps) {
  const {toast} = useToast()
  const {mutateAsync: updateUser, isPending: isLoading} = api.users.updateMe.useMutation()
  const {user: authUser, update} = useUser()
  const form = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: user,
  })

  if (!hasPermission(authUser, 'users', 'edit', user)) {
    return <div>You are not authorized to edit this user</div>
  }

  const onSubmit = async (values: UserProfileForm) => {
    await updateUser(values)
    await update(values)
    toast({
      title: 'Profile Updated!',
      description: 'Your profile was updated successfully.',
      // variant: 'success',
    })
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-5 p-2 md:p-5'>
      <ProfileImageInput />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            control={form.control}
            name='name'
            render={({field}) => (
              <FormItem>
                <FormLabel htmlFor='name'>Name</FormLabel>
                <FormControl>
                  <Input id='name' {...field} value={field.value ?? ''} placeholder='Name' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({field}) => (
              <FormItem>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <FormControl>
                  <Input disabled id='email' {...field} placeholder='Email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({field}) => (
              <FormItem>
                <FormLabel htmlFor='phone'>Phone</FormLabel>
                <FormControl>
                  <PhoneInput id='phone' {...field} value={field.value ?? ''} placeholder='Phone' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='language'
            render={({field}) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => form.setValue('language', value as UserLanguage)}
                    value={field.value}
                  >
                    <SelectTrigger className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                      {field.value
                        ? languages.find((language) => language.value === field.value)?.label
                        : 'Select language'}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {languages.map((language) => (
                          <SelectItem value={language.value} key={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasRole(authUser, ['admin', 'staff']) && (
            <FormField
              control={form.control}
              name='roles'
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className='space-y-2'>
                    {UserRoles.map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name='roles'
                        render={({field}) => {
                          return (
                            <FormItem key={role} className='flex flex-row items-start space-x-3 space-y-0'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role])
                                      : field.onChange(field.value?.filter((value) => value !== role))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className='font-normal'>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div>
            <Button disabled={isLoading} type='submit' className='w-full md:w-fit'>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
