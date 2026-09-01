import { apiClient } from '@/api/client'
import { ANALYTICS_ENDPOINTS } from '@/features/analytics/consts/analytics_endpoints'
import type { Forecast } from '@/features/analytics/consts/analytics_schemas'
import { ForecastSchema } from '@/features/analytics/consts/analytics_schemas'

export const analytics_fetchForecast = (): Promise<Forecast> =>
  apiClient
    .get<unknown>(ANALYTICS_ENDPOINTS.forecast)
    .then((res) => ForecastSchema.parse(res.data))
