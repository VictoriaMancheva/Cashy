import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { analytics_fetchForecast } from '@/features/analytics/api/analytics_fetchForecast'
import { analyticsKeys } from '@/features/analytics/apiKeys'
import type { Forecast } from '@/features/analytics/consts/analytics_schemas'

export const useAnalytics_forecastQuery = (): UseQueryResult<Forecast> =>
  useQuery({ queryKey: analyticsKeys.forecast(), queryFn: analytics_fetchForecast })
