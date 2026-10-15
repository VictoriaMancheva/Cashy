export const DAILY_BUDGET_ENDPOINTS = {
  base: '/api/daily-budgets',
  today: '/api/daily-budgets/today',
  byId: (id: number): string => `/api/daily-budgets/${id}`,
} as const
