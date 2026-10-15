import { z } from 'zod'

import { apiClient } from '@/api/client'
import { TRANSACTIONS_ENDPOINTS } from '@/features/transactions/consts/transactions_endpoints'
import type { Transaction, TransactionFilters } from '@/features/transactions/consts/transactions_schemas'
import { TransactionSchema } from '@/features/transactions/consts/transactions_schemas'

const buildParams = (filters: TransactionFilters): Record<string, string> => {
  const params: Record<string, string> = {}
  if (filters.type) params['type'] = filters.type
  if (filters.from) params['from'] = filters.from
  if (filters.to) params['to'] = filters.to
  if (filters.categoryId != null) params['categoryId'] = String(filters.categoryId)
  if (filters.paymentMethodId != null) params['paymentMethodId'] = String(filters.paymentMethodId)
  if (filters.minAmount) params['minAmount'] = filters.minAmount
  if (filters.maxAmount) params['maxAmount'] = filters.maxAmount
  if (filters.search) params['search'] = filters.search
  return params
}

export const transactions_fetchAll = (filters?: TransactionFilters): Promise<Transaction[]> =>
  apiClient
    .get<unknown>(TRANSACTIONS_ENDPOINTS.base, { params: filters ? buildParams(filters) : undefined })
    .then((res) => z.array(TransactionSchema).parse(res.data))
