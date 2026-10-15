import { DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Auth_LoginForm } from '@/features/auth/components/Auth_LoginForm'
import { useTranslation } from '@/i18n/useTranslation'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/routes'

export const Login_Page = () => {
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-8 w-8 text-primary" />
          <span className="text-3xl font-bold text-foreground">Cashy</span>
        </div>
        <p className="text-muted-foreground text-sm">{t('common.appTagline')}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.signIn')}</CardTitle>
          <CardDescription>{t('auth.signInDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth_LoginForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to={ROUTES.register} className="text-primary hover:underline font-medium">
              {t('auth.createOne')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
