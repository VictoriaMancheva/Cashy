import { apiClient } from '@/api/client'
import { DAILY_BUDGET_ENDPOINTS } from '@/features/dailyBudget/consts/dailyBudget_endpoints'
import type { DailyBudget, DailyBudgetFormValues } from '@/features/dailyBudget/consts/dailyBudget_schemas'
import { DailyBudgetSchema } from '@/features/dailyBudget/consts/dailyBudget_schemas'

export const dailyBudget_set = (data: DailyBudgetFormValues): Promise<DailyBudget> =>
  apiClient
    .post<unknown>(DAILY_BUDGET_ENDPOINTS.base, data)
    .then((res) => DailyBudgetSchema.parse(res.data))
