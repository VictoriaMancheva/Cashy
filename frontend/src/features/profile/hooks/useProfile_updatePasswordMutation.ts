import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { profile_updatePassword } from '@/features/profile/api/profile_updatePassword'

export const useProfile_updatePasswordMutation = (): UseMutationResult<
  void,
  Error,
  { currentPassword: string; newPassword: string }
> =>
  useMutation({
    mutationFn: profile_updatePassword,
  })
