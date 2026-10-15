import { apiClient } from '@/api/client'
import { DAILY_BUDGET_ENDPOINTS } from '@/features/dailyBudget/consts/dailyBudget_endpoints'
import type { TodayBudget } from '@/features/dailyBudget/consts/dailyBudget_schemas'
import { TodayBudgetSchema } from '@/features/dailyBudget/consts/dailyBudget_schemas'

export const dailyBudget_fetchToday = (): Promise<TodayBudget> =>
  apiClient
    .get<unknown>(DAILY_BUDGET_ENDPOINTS.today)
    .then((res) => TodayBudgetSchema.parse(res.data))
