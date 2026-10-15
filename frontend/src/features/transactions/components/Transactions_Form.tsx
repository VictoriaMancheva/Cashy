import { useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ScanLine } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { PremiumGate } from '@/components/common/PremiumGate'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CONFIG } from '@/config'
import type { Transaction, TransactionFormValues } from '@/features/transactions/consts/transactions_schemas'
import { TransactionFormSchema } from '@/features/transactions/consts/transactions_schemas'
import { useTransactions_createMutation } from '@/features/transactions/hooks/useTransactions_createMutation'
import { useTransactions_scanReceiptMutation } from '@/features/transactions/hooks/useTransactions_scanReceiptMutation'
import { useTransactions_updateMutation } from '@/features/transactions/hooks/useTransactions_updateMutation'
import { useTranslation } from '@/i18n/useTranslation'
import { useSharedCategories } from '@/hooks/useSharedCategories'
import { useSharedPaymentMethods } from '@/hooks/useSharedPaymentMethods'
import { SELECT_NONE } from '@/utils/formatters'

type Props = {
  defaultValues?: Transaction | null
  onSuccess: () => void
}

export const Transactions_Form = ({ defaultValues, onSuccess }: Props) => {
  const { data: categories } = useSharedCategories()
  const { data: paymentMethods } = useSharedPaymentMethods()
  const createMutation = useTransactions_createMutation()
  const updateMutation = useTransactions_updateMutation()
  const scanMutation = useTransactions_scanReceiptMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const isPending = createMutation.isPending || updateMutation.isPending || scanMutation.isPending

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? 0,
      type: defaultValues?.type ?? 'EXPENSE',
      description: defaultValues?.description ?? '',
      date: defaultValues?.date ?? new Date().toISOString().split('T')[0],
      categoryId: defaultValues?.categoryId ?? null,
      paymentMethodId: defaultValues?.paymentMethodId ?? null,
      receiptImage: defaultValues?.receiptImage ?? null,
    },
  })

  useEffect(() => {
    form.reset({
      amount: defaultValues?.amount ?? 0,
      type: defaultValues?.type ?? 'EXPENSE',
      description: defaultValues?.description ?? '',
      date: defaultValues?.date ?? new Date().toISOString().split('T')[0],
      categoryId: defaultValues?.categoryId ?? null,
      paymentMethodId: defaultValues?.paymentMethodId ?? null,
      receiptImage: defaultValues?.receiptImage ?? null,
    })
  }, [defaultValues, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    scanMutation.mutate(file, {
      onSuccess: (result) => {
        if (result.amount != null) form.setValue('amount', result.amount)
        if (result.description) form.setValue('description', result.description)
        if (result.date) form.setValue('date', result.date)
        if (result.receiptImage) form.setValue('receiptImage', result.receiptImage)
      },
    })
  }

  const onSubmit = (values: TransactionFormValues) => {
    if (defaultValues?.id != null) {
      updateMutation.mutate({ id: defaultValues.id, data: values }, { onSuccess })
    } else {
      createMutation.mutate(values, { onSuccess })
    }
  }

  const receiptImage = form.watch('receiptImage')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PremiumGate compact>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanMutation.isPending}
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('transactions.scanning')}
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-4 w-4" />
                  {t('transactions.scanReceipt')}
                </>
              )}
            </Button>
            {scanMutation.isError && (
              <p className="text-sm text-destructive">{t('transactions.scanFailed')}</p>
            )}
            {receiptImage && (
              <img
                src={`${CONFIG.cashyApiBaseUrl}${receiptImage}`}
                alt={t('transactions.scannedReceiptAlt')}
                className="max-h-48 w-full rounded border object-contain"
              />
            )}
          </div>
        </PremiumGate>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.amount')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.type')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('transactions.typePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">{t('transactionType.INCOME')}</SelectItem>
                  <SelectItem value="EXPENSE">{t('transactionType.EXPENSE')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.description')}</FormLabel>
              <FormControl>
                <Input placeholder={t('common.descriptionPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.date')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.category')}</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === SELECT_NONE ? null : Number(v))}
                value={field.value != null ? String(field.value) : SELECT_NONE}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.categoryPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SELECT_NONE}>{t('common.none')}</SelectItem>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethodId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.paymentMethod')}</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === SELECT_NONE ? null : Number(v))}
                value={field.value != null ? String(field.value) : SELECT_NONE}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.paymentMethodPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SELECT_NONE}>{t('common.none')}</SelectItem>
                  {paymentMethods?.map((pm) => (
                    <SelectItem key={pm.id} value={String(pm.id)}>
                      {pm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues != null ? t('common.saveChanges') : t('transactions.add')}
        </Button>
      </form>
    </Form>
  )
}
