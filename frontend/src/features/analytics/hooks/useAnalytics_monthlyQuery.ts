import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { analytics_fetchMonthly } from '@/features/analytics/api/analytics_fetchMonthly'
import { analyticsKeys } from '@/features/analytics/apiKeys'
import type { MonthlyBreakdown } from '@/features/analytics/consts/analytics_schemas'

export const useAnalytics_monthlyQuery = (): UseQueryResult<MonthlyBreakdown[]> =>
  useQuery({ queryKey: analyticsKeys.monthly(), queryFn: analytics_fetchMonthly })
