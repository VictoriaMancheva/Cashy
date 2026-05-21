export const CATEGORIES_ENDPOINTS = {
  base: '/api/categories',
  byId: (id: number) => `/api/categories/${id}`,
} as const
