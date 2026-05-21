import { apiClient } from '@/api/client'
import { CATEGORIES_ENDPOINTS } from '@/features/categories/consts/categories_endpoints'

export const categories_delete = (id: number): Promise<void> =>
  apiClient.delete(CATEGORIES_ENDPOINTS.byId(id)).then(() => undefined)
