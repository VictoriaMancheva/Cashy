import { apiClient } from '@/api/client'
import { DASHBOARD_ENDPOINTS } from '@/features/dashboard/consts/dashboard_endpoints'
import { DashboardSummarySchema } from '@/features/dashboard/consts/dashboard_schemas'
import type { DashboardSummary } from '@/features/dashboard/consts/dashboard_schemas'

export const dashboard_fetchSummary = (): Promise<DashboardSummary> =>
  apiClient
    .get<unknown>(DASHBOARD_ENDPOINTS.summary)
    .then((res) => DashboardSummarySchema.parse(res.data))
