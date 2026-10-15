import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { PasswordFormValues } from '@/features/profile/consts/profile_schemas'
import { PasswordFormSchema } from '@/features/profile/consts/profile_schemas'
import { useProfile_updatePasswordMutation } from '@/features/profile/hooks/useProfile_updatePasswordMutation'
import { useTranslation } from '@/i18n/useTranslation'

export const Profile_PasswordForm = () => {
  const updateMutation = useProfile_updatePasswordMutation()
  const { t } = useTranslation()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: PasswordFormValues) => {
    updateMutation.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          form.reset()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.currentPassword')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('profile.currentPasswordPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.newPassword')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('profile.newPasswordPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.confirmPassword')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('profile.confirmPasswordPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('profile.changePassword')}
        </Button>
      </form>
    </Form>
  )
}
