export const RECURRING_TRANSACTIONS_ENDPOINTS = {
  base: '/api/recurring-transactions',
  byId: (id: number) => `/api/recurring-transactions/${id}`,
  apply: (id: number) => `/api/recurring-transactions/${id}/apply`,
} as const
