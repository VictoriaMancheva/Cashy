import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/useTranslation'

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationControls = ({ page, totalPages, onPageChange }: Props) => {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('common.previousPage')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        {t('common.pageOf', { page: String(page), total: String(totalPages) })}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.nextPage')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
