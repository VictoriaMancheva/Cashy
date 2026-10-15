import axios from 'axios'
import { z } from 'zod'

const ApiErrorBodySchema = z.object({ message: z.string() })

// Returns the backend's ErrorResponse message when there is one
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback
  const parsed = ApiErrorBodySchema.safeParse(error.response?.data)
  return parsed.success ? parsed.data.message : fallback
}
