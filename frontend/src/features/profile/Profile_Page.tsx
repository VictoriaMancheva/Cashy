import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Profile_PasswordForm } from '@/features/profile/components/Profile_PasswordForm'
import { Profile_UsernameForm } from '@/features/profile/components/Profile_UsernameForm'
import { useProfile_meQuery } from '@/features/profile/hooks/useProfile_meQuery'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatDate } from '@/utils/formatters'
import { isRole } from '@/utils/roles'

export const Profile_Page = () => {
  const { data: user } = useProfile_meQuery()
  const { t } = useTranslation()

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.accountInfo')}</CardTitle>
            <CardDescription>{t('profile.accountDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('auth.email')}</span>
              <span>{user?.email ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('auth.username')}</span>
              <span>{user?.username ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('profile.role')}</span>
              <span>{user != null && isRole(user.role) ? t(`roles.${user.role}` as const) : '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('profile.memberSince')}</span>
              <span>{formatDate(user?.createdAt ?? null)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.changeUsername')}</CardTitle>
            <CardDescription>{t('profile.changeUsernameDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Profile_UsernameForm currentUsername={user?.username ?? ''} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.changePassword')}</CardTitle>
            <CardDescription>{t('profile.changePasswordDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Profile_PasswordForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
