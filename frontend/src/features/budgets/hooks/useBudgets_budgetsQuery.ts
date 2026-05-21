import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { budgets_fetchAll } from '@/features/budgets/api/budgets_fetchAll'
import { budgetKeys } from '@/features/budgets/apiKeys'
import type { Budget } from '@/features/budgets/consts/budgets_schemas'

export const useBudgets_budgetsQuery = (): UseQueryResult<Budget[]> =>
  useQuery({ queryKey: budgetKeys.all(), queryFn: budgets_fetchAll })
