import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { analytics_fetchByCategory } from '@/features/analytics/api/analytics_fetchByCategory'
import { analyticsKeys } from '@/features/analytics/apiKeys'
import type { CategoryBreakdown } from '@/features/analytics/consts/analytics_schemas'

export const useAnalytics_byCategoryQuery = (month: number, year: number): UseQueryResult<CategoryBreakdown[]> =>
  useQuery({ queryKey: analyticsKeys.byCategory(month, year), queryFn: () => analytics_fetchByCategory(month, year) })
