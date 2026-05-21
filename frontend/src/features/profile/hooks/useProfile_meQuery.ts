import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { profile_fetchMe } from '@/features/profile/api/profile_fetchMe'
import { profileKeys } from '@/features/profile/apiKeys'
import type { User } from '@/features/profile/consts/profile_schemas'

export const useProfile_meQuery = (): UseQueryResult<User> =>
  useQuery({ queryKey: profileKeys.me(), queryFn: profile_fetchMe })
