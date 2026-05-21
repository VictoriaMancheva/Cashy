import { apiClient } from '@/api/client'
import { GOALS_ENDPOINTS } from '@/features/goals/consts/goals_endpoints'
import type { Goal, GoalFormValues } from '@/features/goals/consts/goals_schemas'
import { GoalSchema } from '@/features/goals/consts/goals_schemas'

export const goals_create = (data: GoalFormValues): Promise<Goal> =>
  apiClient
    .post<unknown>(GOALS_ENDPOINTS.base, data)
    .then((res) => GoalSchema.parse(res.data))
