export const BUDGETS_ENDPOINTS = {
  base: '/api/budgets',
  byId: (id: number) => `/api/budgets/${id}`,
} as const
