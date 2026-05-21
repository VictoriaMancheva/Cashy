import { apiClient } from '@/api/client'
import { GOALS_ENDPOINTS } from '@/features/goals/consts/goals_endpoints'
import type { Goal } from '@/features/goals/consts/goals_schemas'
import { GoalSchema } from '@/features/goals/consts/goals_schemas'

type AddFundsArgs = {
  id: number
  amount: number
}

export const goals_addFunds = ({ id, amount }: AddFundsArgs): Promise<Goal> =>
  apiClient
    .patch<unknown>(`${GOALS_ENDPOINTS.addFunds(id)}?amount=${amount}`)
    .then((res) => GoalSchema.parse(res.data))
