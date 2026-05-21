import { Navigate } from 'react-router-dom'

import { ROUTES } from '@/routes'

type Props = {
  children: React.ReactNode
}

export const PublicRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to={ROUTES.dashboard} replace />
  return <>{children}</>
}
