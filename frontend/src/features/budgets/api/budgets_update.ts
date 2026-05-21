import { apiClient } from '@/api/client'
import { BUDGETS_ENDPOINTS } from '@/features/budgets/consts/budgets_endpoints'
import type { Budget, BudgetFormValues } from '@/features/budgets/consts/budgets_schemas'
import { BudgetSchema } from '@/features/budgets/consts/budgets_schemas'

export const budgets_update = ({
  id,
  data,
}: {
  id: number
  data: BudgetFormValues
}): Promise<Budget> =>
  apiClient
    .put<unknown>(BUDGETS_ENDPOINTS.byId(id), data)
    .then((res) => BudgetSchema.parse(res.data))
