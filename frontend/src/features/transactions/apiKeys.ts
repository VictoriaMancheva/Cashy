import type { TransactionFilters } from '@/features/transactions/consts/transactions_schemas'

export const transactionKeys = {
  all: () => ['transactions'] as const,
  filtered: (filters: TransactionFilters) => ['transactions', 'filtered', filters] as const,
}
