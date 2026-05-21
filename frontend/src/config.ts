export const CONFIG = {
  cashyApiBaseUrl: import.meta.env.VITE_CASHY_API_BASE_URL ?? 'http://localhost:8080',
} as const
