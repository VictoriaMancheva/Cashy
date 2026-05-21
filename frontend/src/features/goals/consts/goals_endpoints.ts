export const GOALS_ENDPOINTS = {
  base: '/api/goals',
  byId: (id: number) => `/api/goals/${id}`,
  addFunds: (id: number) => `/api/goals/${id}/funds`,
} as const
