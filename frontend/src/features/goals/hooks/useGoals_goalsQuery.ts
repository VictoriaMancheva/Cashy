import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { goals_fetchAll } from '@/features/goals/api/goals_fetchAll'
import { goalKeys } from '@/features/goals/apiKeys'
import type { Goal } from '@/features/goals/consts/goals_schemas'

export const useGoals_goalsQuery = (): UseQueryResult<Goal[]> =>
  useQuery({
    queryKey: goalKeys.all(),
    queryFn: goals_fetchAll,
  })
