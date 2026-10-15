import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TransactionFilters } from '@/features/transactions/consts/transactions_schemas'
import { useSharedCategories } from '@/hooks/useSharedCategories'
import { useSharedPaymentMethods } from '@/hooks/useSharedPaymentMethods'
import { useTranslation } from '@/i18n/useTranslation'
import { SELECT_NONE } from '@/utils/formatters'

type Props = {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
  searchInput: string
  onSearchInput: (value: string) => void
}

export const Transactions_FiltersBar = ({ filters, onChange, searchInput, onSearchInput }: Props) => {
  const { data: categories } = useSharedCategories()
  const { data: paymentMethods } = useSharedPaymentMethods()
  const { t } = useTranslation()

  const set = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const hasActiveFilters =
    searchInput !== '' ||
    filters.from !== '' ||
    filters.to !== '' ||
    filters.categoryId != null ||
    filters.paymentMethodId != null ||
    filters.minAmount !== '' ||
    filters.maxAmount !== ''

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div className="flex-1 min-w-48">
        <Input
          placeholder={t('transactions.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
        />
      </div>

      <Input
        type="date"
        className="w-36"
        value={filters.from}
        onChange={(e) => set('from', e.target.value)}
        aria-label={t('transactions.fromDate')}
      />

      <Input
        type="date"
        className="w-36"
        value={filters.to}
        onChange={(e) => set('to', e.target.value)}
        aria-label={t('transactions.toDate')}
      />

      <Select
        value={filters.categoryId != null ? String(filters.categoryId) : SELECT_NONE}
        onValueChange={(v) => set('categoryId', v === SELECT_NONE ? null : Number(v))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('common.category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SELECT_NONE}>{t('transactions.allCategories')}</SelectItem>
          {categories?.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.paymentMethodId != null ? String(filters.paymentMethodId) : SELECT_NONE}
        onValueChange={(v) => set('paymentMethodId', v === SELECT_NONE ? null : Number(v))}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t('common.paymentMethod')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SELECT_NONE}>{t('transactions.allMethods')}</SelectItem>
          {paymentMethods?.map((pm) => (
            <SelectItem key={pm.id} value={String(pm.id)}>
              {pm.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder={t('transactions.minAmount')}
        className="w-28"
        value={filters.minAmount}
        onChange={(e) => set('minAmount', e.target.value)}
      />

      <Input
        type="number"
        placeholder={t('transactions.maxAmount')}
        className="w-28"
        value={filters.maxAmount}
        onChange={(e) => set('maxAmount', e.target.value)}
      />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange({ ...filters, from: '', to: '', categoryId: null, paymentMethodId: null, minAmount: '', maxAmount: '', search: '' })
            onSearchInput('')
          }}
        >
          <X className="h-4 w-4 mr-1" />
          {t('transactions.clearFilters')}
        </Button>
      )}
    </div>
  )
}
