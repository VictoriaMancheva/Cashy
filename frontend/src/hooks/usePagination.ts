import { useEffect, useMemo, useState } from 'react'

// One page size for every paginated list in the app
export const DEFAULT_PAGE_SIZE = 10

export const usePagination = <T>(items: T[] | undefined, pageSize: number, resetKey?: unknown) => {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [resetKey])

  const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => (items ?? []).slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  )

  return { page: safePage, setPage, totalPages, pageItems }
}
