import { Navigate } from 'react-router-dom'

import { ROUTES } from '@/routes'

type Props = {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to={ROUTES.login} replace />
  return <>{children}</>
}
