import { useQuery } from '@tanstack/react-query'

import { shared_fetchCategories } from '@/api/shared'

export const useSharedCategories = () =>
  useQuery({ queryKey: ['shared', 'categories'], queryFn: shared_fetchCategories })
