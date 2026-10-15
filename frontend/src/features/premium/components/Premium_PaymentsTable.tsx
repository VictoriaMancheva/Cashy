import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Payment } from '@/features/premium/consts/premium_schemas'
import { useTranslation } from '@/i18n/useTranslation'
import { formatDate, formatMoney } from '@/utils/formatters'

type Props = {
  payments: Payment[]
}

export const Premium_PaymentsTable = ({ payments }: Props) => {
  const { t } = useTranslation()

  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('premium.noPayments')}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('common.date')}</TableHead>
          <TableHead>{t('common.amount')}</TableHead>
          <TableHead>{t('premium.status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDate(payment.paidAt ?? payment.createdAt)}</TableCell>
            <TableCell>{formatMoney(payment.amount, payment.currency)}</TableCell>
            <TableCell>
              <Badge variant={payment.status === 'PAID' ? 'income' : 'secondary'}>
                {t(`premium.status${payment.status}` as const)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
