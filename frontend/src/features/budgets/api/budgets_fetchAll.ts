import { z } from 'zod'

import { apiClient } from '@/api/client'
import { BUDGETS_ENDPOINTS } from '@/features/budgets/consts/budgets_endpoints'
import type { Budget } from '@/features/budgets/consts/budgets_schemas'
import { BudgetSchema } from '@/features/budgets/consts/budgets_schemas'

export const budgets_fetchAll = (): Promise<Budget[]> =>
  apiClient
    .get<unknown>(BUDGETS_ENDPOINTS.base)
    .then((res) => z.array(BudgetSchema).parse(res.data))
