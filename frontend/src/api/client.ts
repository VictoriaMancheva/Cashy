import axios from 'axios'

import { CONFIG } from '@/config'

export const apiClient = axios.create({
  baseURL: CONFIG.cashyApiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const isAuthPage =
      window.location.pathname.startsWith('/login') ||
      window.location.pathname.startsWith('/register')

    if (
      !isAuthPage &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
