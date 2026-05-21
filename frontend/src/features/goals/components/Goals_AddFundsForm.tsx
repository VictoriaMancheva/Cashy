import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGoals_addFundsMutation } from '@/features/goals/hooks/useGoals_addFundsMutation'

const AddFundsSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
})

type AddFundsValues = z.infer<typeof AddFundsSchema>

type Props = {
  goalId: number
  onSuccess: () => void
}

export const Goals_AddFundsForm = ({ goalId, onSuccess }: Props) => {
  const addFundsMutation = useGoals_addFundsMutation()

  const form = useForm<AddFundsValues>({
    resolver: zodResolver(AddFundsSchema),
    defaultValues: { amount: 0 },
  })

  const onSubmit = (values: AddFundsValues) => {
    addFundsMutation.mutate(
      { id: goalId, amount: values.amount },
      { onSuccess }
    )
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
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={addFundsMutation.isPending} className="w-full">
          {addFundsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Funds
        </Button>
      </form>
    </Form>
  )
}
