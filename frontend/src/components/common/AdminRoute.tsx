import { Navigate } from 'react-router-dom'

import { useProfile_meQuery } from '@/features/profile/hooks/useProfile_meQuery'
import { ROUTES } from '@/routes'

type Props = {
  children: React.ReactNode
}

export const AdminRoute = ({ children }: Props) => {
  const { data: user, isLoading } = useProfile_meQuery()

  const token = localStorage.getItem('token')
  if (!token) return <Navigate to={ROUTES.login} replace />
  if (isLoading) return null
  if (user?.role !== 'ADMIN') return <Navigate to={ROUTES.dashboard} replace />

  return <>{children}</>
}
