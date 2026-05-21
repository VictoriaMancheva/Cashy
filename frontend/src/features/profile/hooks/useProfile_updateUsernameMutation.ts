import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { profile_updateUsername } from '@/features/profile/api/profile_updateUsername'
import { profileKeys } from '@/features/profile/apiKeys'
import type { User, UsernameFormValues } from '@/features/profile/consts/profile_schemas'

export const useProfile_updateUsernameMutation = (): UseMutationResult<User, Error, UsernameFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: profile_updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}
