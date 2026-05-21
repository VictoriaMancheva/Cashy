import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DailyBudgetFormSchema } from '@/features/dailyBudget/consts/dailyBudget_schemas'
import type { DailyBudgetFormValues } from '@/features/dailyBudget/consts/dailyBudget_schemas'
import { useDailyBudget_setMutation } from '@/features/dailyBudget/hooks/useDailyBudget_setMutation'

const TODAY = new Date().toISOString().split('T')[0]

type Props = {
  onSuccess: () => void
}

export const DailyBudget_Form = ({ onSuccess }: Props) => {
  const setMutation = useDailyBudget_setMutation()

  const form = useForm<DailyBudgetFormValues>({
    resolver: zodResolver(DailyBudgetFormSchema),
    defaultValues: {
      dailyLimit: 0,
      date: TODAY,
    },
  })

  const onSubmit = (values: DailyBudgetFormValues) => {
    setMutation.mutate(values, { onSuccess })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dailyLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
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
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={setMutation.isPending} className="w-full">
          {setMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Set Daily Budget
        </Button>
      </form>
    </Form>
  )
}
