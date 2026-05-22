import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { dashboard_fetchSummary } from '@/features/dashboard/api/dashboard_fetchSummary'
import { dashboardKeys } from '@/features/dashboard/apiKeys'
import type { DashboardSummary } from '@/features/dashboard/consts/dashboard_schemas'

export const useDashboard_summaryQuery = (): UseQueryResult<DashboardSummary> =>
  useQuery({ queryKey: dashboardKeys.summary(), queryFn: dashboard_fetchSummary })
