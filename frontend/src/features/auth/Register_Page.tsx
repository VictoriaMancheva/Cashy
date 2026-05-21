import { DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Auth_RegisterForm } from '@/features/auth/components/Auth_RegisterForm'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/routes'

export const Register_Page = () => (
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
        <CardTitle>Create account</CardTitle>
        <CardDescription>Sign up to start tracking your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <Auth_RegisterForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.login} className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  </AuthLayout>
)
