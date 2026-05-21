import { z } from 'zod'

import { apiClient } from '@/api/client'
import { GOALS_ENDPOINTS } from '@/features/goals/consts/goals_endpoints'
import type { Goal } from '@/features/goals/consts/goals_schemas'
import { GoalSchema } from '@/features/goals/consts/goals_schemas'

export const goals_fetchAll = (): Promise<Goal[]> =>
  apiClient
    .get<unknown>(GOALS_ENDPOINTS.base)
    .then((res) => z.array(GoalSchema).parse(res.data))
