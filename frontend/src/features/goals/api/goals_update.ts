import { apiClient } from '@/api/client'
import { GOALS_ENDPOINTS } from '@/features/goals/consts/goals_endpoints'
import type { Goal, GoalFormValues } from '@/features/goals/consts/goals_schemas'
import { GoalSchema } from '@/features/goals/consts/goals_schemas'

type UpdateGoalArgs = {
  id: number
  data: GoalFormValues
}

export const goals_update = ({ id, data }: UpdateGoalArgs): Promise<Goal> =>
  apiClient
    .put<unknown>(GOALS_ENDPOINTS.byId(id), data)
    .then((res) => GoalSchema.parse(res.data))
