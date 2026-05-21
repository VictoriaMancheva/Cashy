import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { auth_login } from '@/features/auth/api/auth_login'
import { ROUTES } from '@/routes'

export const useAuth_loginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: auth_login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      navigate(ROUTES.dashboard)
    },
  })
}
