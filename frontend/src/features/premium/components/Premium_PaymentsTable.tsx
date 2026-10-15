import { Badge } from '@/components/ui/badge'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Payment } from '@/features/premium/consts/premium_schemas'
import { DEFAULT_PAGE_SIZE, usePagination } from '@/hooks/usePagination'
import { useTranslation } from '@/i18n/useTranslation'
import { formatDate, formatMoney } from '@/utils/formatters'

const PAYMENT_STATUS_BADGE = {
  PAID: 'income',
  FAILED: 'expense',
  PENDING: 'secondary',
} as const satisfies Record<Payment['status'], string>

type Props = {
  payments: Payment[]
}

export const Premium_PaymentsTable = ({ payments }: Props) => {
  const { t } = useTranslation()
  const { page, setPage, totalPages, pageItems } = usePagination(payments, DEFAULT_PAGE_SIZE)

  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('premium.noPayments')}</p>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.date')}</TableHead>
            <TableHead>{t('common.amount')}</TableHead>
            <TableHead>{t('premium.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.paidAt ?? payment.createdAt)}</TableCell>
              <TableCell>{formatMoney(payment.amount, payment.currency)}</TableCell>
              <TableCell>
                <Badge variant={PAYMENT_STATUS_BADGE[payment.status]}>
                  {t(`premium.status${payment.status}` as const)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}
