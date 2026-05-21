export const DAILY_BUDGET_ENDPOINTS = {
  base: '/api/daily-budgets',
  byId: (id: number): string => `/api/daily-budgets/${id}`,
} as const
