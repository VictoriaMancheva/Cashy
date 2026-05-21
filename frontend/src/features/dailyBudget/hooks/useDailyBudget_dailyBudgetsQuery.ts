import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { dailyBudget_fetchAll } from '@/features/dailyBudget/api/dailyBudget_fetchAll'
import { dailyBudgetKeys } from '@/features/dailyBudget/apiKeys'
import type { DailyBudget } from '@/features/dailyBudget/consts/dailyBudget_schemas'

export const useDailyBudget_dailyBudgetsQuery = (): UseQueryResult<DailyBudget[]> =>
  useQuery({
    queryKey: dailyBudgetKeys.all(),
    queryFn: dailyBudget_fetchAll,
  })
