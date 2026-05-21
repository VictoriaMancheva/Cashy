import { z } from 'zod'

import { apiClient } from '@/api/client'
import { DAILY_BUDGET_ENDPOINTS } from '@/features/dailyBudget/consts/dailyBudget_endpoints'
import type { DailyBudget } from '@/features/dailyBudget/consts/dailyBudget_schemas'
import { DailyBudgetSchema } from '@/features/dailyBudget/consts/dailyBudget_schemas'

export const dailyBudget_fetchAll = (): Promise<DailyBudget[]> =>
  apiClient
    .get<unknown>(DAILY_BUDGET_ENDPOINTS.base)
    .then((res) => z.array(DailyBudgetSchema).parse(res.data))
