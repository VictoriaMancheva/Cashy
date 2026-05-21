import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { auth_register } from '@/features/auth/api/auth_register'
import { ROUTES } from '@/routes'

export const useAuth_registerMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: auth_register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      navigate(ROUTES.dashboard)
    },
  })
}
