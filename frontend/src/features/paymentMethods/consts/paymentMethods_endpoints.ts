export const PAYMENT_METHODS_ENDPOINTS = {
  base: '/api/payment-methods',
  byId: (id: number): string => `/api/payment-methods/${id}`,
} as const
