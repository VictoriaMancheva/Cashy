import { apiClient } from '@/api/client'
import { ANALYTICS_ENDPOINTS } from '@/features/analytics/consts/analytics_endpoints'
import { MonthlyBreakdownSchema } from '@/features/analytics/consts/analytics_schemas'
import type { MonthlyBreakdown } from '@/features/analytics/consts/analytics_schemas'

export const analytics_fetchMonthly = (): Promise<MonthlyBreakdown[]> =>
  apiClient
    .get<unknown>(ANALYTICS_ENDPOINTS.monthly)
    .then((res) => MonthlyBreakdownSchema.array().parse(res.data))
