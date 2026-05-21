import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { UsernameFormValues } from '@/features/profile/consts/profile_schemas'
import { UsernameFormSchema } from '@/features/profile/consts/profile_schemas'
import { useProfile_updateUsernameMutation } from '@/features/profile/hooks/useProfile_updateUsernameMutation'

type Props = {
  currentUsername: string
}

export const Profile_UsernameForm = ({ currentUsername }: Props) => {
  const updateMutation = useProfile_updateUsernameMutation()

  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(UsernameFormSchema),
    defaultValues: { username: currentUsername },
  })

  const onSubmit = (values: UsernameFormValues) => {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Username
        </Button>
      </form>
    </Form>
  )
}
