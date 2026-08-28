import { apiClient } from '@/api/client'
import { ANALYTICS_ENDPOINTS } from '@/features/analytics/consts/analytics_endpoints'
import { CategoryBreakdownSchema } from '@/features/analytics/consts/analytics_schemas'
import type { CategoryBreakdown } from '@/features/analytics/consts/analytics_schemas'

export const analytics_fetchByCategory = (month: number, year: number): Promise<CategoryBreakdown[]> =>
  apiClient
    .get<unknown>(ANALYTICS_ENDPOINTS.byCategory, { params: { month, year } })
    .then((res) => CategoryBreakdownSchema.array().parse(res.data))
