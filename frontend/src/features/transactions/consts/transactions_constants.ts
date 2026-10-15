import type { TransactionFilters } from '@/features/transactions/consts/transactions_schemas'

export const TRANSACTION_FILTER_DEBOUNCE_MS = 300

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
  search: '',
  type: '',
  from: '',
  to: '',
  categoryId: null,
  paymentMethodId: null,
  minAmount: '',
  maxAmount: '',
}
