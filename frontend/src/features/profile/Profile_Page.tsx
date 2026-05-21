import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Profile_PasswordForm } from '@/features/profile/components/Profile_PasswordForm'
import { Profile_UsernameForm } from '@/features/profile/components/Profile_UsernameForm'
import { useProfile_meQuery } from '@/features/profile/hooks/useProfile_meQuery'
import { AppLayout } from '@/layouts/AppLayout'
import { formatDate } from '@/utils/formatters'

export const Profile_Page = () => {
  const { data: user } = useProfile_meQuery()

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{user?.email ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username</span>
              <span>{user?.username ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <span className="capitalize">{user?.role?.toLowerCase() ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>{formatDate(user?.createdAt ?? null)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Username</CardTitle>
            <CardDescription>Update your display name</CardDescription>
          </CardHeader>
          <CardContent>
            <Profile_UsernameForm currentUsername={user?.username ?? ''} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <Profile_PasswordForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
