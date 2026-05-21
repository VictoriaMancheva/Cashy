import { apiClient } from '@/api/client'
import { BUDGETS_ENDPOINTS } from '@/features/budgets/consts/budgets_endpoints'
import type { Budget, BudgetFormValues } from '@/features/budgets/consts/budgets_schemas'
import { BudgetSchema } from '@/features/budgets/consts/budgets_schemas'

export const budgets_create = (data: BudgetFormValues): Promise<Budget> =>
  apiClient
    .post<unknown>(BUDGETS_ENDPOINTS.base, data)
    .then((res) => BudgetSchema.parse(res.data))
