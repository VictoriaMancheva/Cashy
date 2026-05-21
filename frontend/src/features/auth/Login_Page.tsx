import { DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Auth_LoginForm } from '@/features/auth/components/Auth_LoginForm'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/routes'

export const Login_Page = () => (
  <AuthLayout>
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="h-8 w-8 text-primary" />
        <span className="text-3xl font-bold text-foreground">Cashy</span>
      </div>
      <p className="text-muted-foreground text-sm">Your personal finance tracker</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Auth_LoginForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.register} className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  </AuthLayout>
)
