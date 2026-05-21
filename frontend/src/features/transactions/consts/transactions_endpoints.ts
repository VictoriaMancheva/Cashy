export const TRANSACTIONS_ENDPOINTS = {
  base: '/api/transactions',
  byId: (id: number) => `/api/transactions/${id}`,
} as const
