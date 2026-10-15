import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { dailyBudget_fetchToday } from '@/features/dailyBudget/api/dailyBudget_fetchToday'
import { dailyBudgetKeys } from '@/features/dailyBudget/apiKeys'
import type { TodayBudget } from '@/features/dailyBudget/consts/dailyBudget_schemas'

export const useDailyBudget_todayQuery = (): UseQueryResult<TodayBudget> =>
  useQuery({
    queryKey: dailyBudgetKeys.today(),
    queryFn: dailyBudget_fetchToday,
  })
