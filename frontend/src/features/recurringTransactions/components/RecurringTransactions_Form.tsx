import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RecurringTransaction, RecurringTransactionFormValues } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'
import { RecurringTransactionFormSchema } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'
import { useRecurringTransactions_createMutation } from '@/features/recurringTransactions/hooks/useRecurringTransactions_createMutation'
import { useRecurringTransactions_updateMutation } from '@/features/recurringTransactions/hooks/useRecurringTransactions_updateMutation'
import { useSharedCategories } from '@/hooks/useSharedCategories'
import { useSharedPaymentMethods } from '@/hooks/useSharedPaymentMethods'
import { SELECT_NONE } from '@/utils/formatters'

type Props = {
  defaultValues?: RecurringTransaction | null
  onSuccess: () => void
}

export const RecurringTransactions_Form = ({ defaultValues, onSuccess }: Props) => {
  const { data: categories } = useSharedCategories()
  const { data: paymentMethods } = useSharedPaymentMethods()
  const createMutation = useRecurringTransactions_createMutation()
  const updateMutation = useRecurringTransactions_updateMutation()

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<RecurringTransactionFormValues>({
    resolver: zodResolver(RecurringTransactionFormSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? 0,
      description: defaultValues?.description ?? '',
      frequency: defaultValues?.frequency ?? 'MONTHLY',
      type: defaultValues?.type ?? 'EXPENSE',
      nextDate: defaultValues?.nextDate ?? new Date().toISOString().split('T')[0],
      categoryId: defaultValues?.categoryId ?? null,
      paymentMethodId: defaultValues?.paymentMethodId ?? null,
    },
  })

  useEffect(() => {
    form.reset({
      amount: defaultValues?.amount ?? 0,
      description: defaultValues?.description ?? '',
      frequency: defaultValues?.frequency ?? 'MONTHLY',
      type: defaultValues?.type ?? 'EXPENSE',
      nextDate: defaultValues?.nextDate ?? new Date().toISOString().split('T')[0],
      categoryId: defaultValues?.categoryId ?? null,
      paymentMethodId: defaultValues?.paymentMethodId ?? null,
    })
  }, [defaultValues, form])

  const onSubmit = (values: RecurringTransactionFormValues) => {
    if (defaultValues?.id != null) {
      updateMutation.mutate({ id: defaultValues.id, data: values }, { onSuccess })
    } else {
      createMutation.mutate(values, { onSuccess })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nextDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Date</FormLabel>
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
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === SELECT_NONE ? null : Number(v))}
                value={field.value != null ? String(field.value) : SELECT_NONE}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SELECT_NONE}>None</SelectItem>
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
              <FormLabel>Payment Method</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === SELECT_NONE ? null : Number(v))}
                value={field.value != null ? String(field.value) : SELECT_NONE}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SELECT_NONE}>None</SelectItem>
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
          {defaultValues != null ? 'Save Changes' : 'Create Recurring'}
        </Button>
      </form>
    </Form>
  )
}
