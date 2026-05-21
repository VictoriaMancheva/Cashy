import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Goal, GoalFormValues } from '@/features/goals/consts/goals_schemas'
import { GoalFormSchema } from '@/features/goals/consts/goals_schemas'
import { useGoals_createMutation } from '@/features/goals/hooks/useGoals_createMutation'
import { useGoals_updateMutation } from '@/features/goals/hooks/useGoals_updateMutation'

type Props = {
  defaultValues?: Goal | null
  onSuccess: () => void
}

export const Goals_Form = ({ defaultValues, onSuccess }: Props) => {
  const isEditing = defaultValues != null

  const createMutation = useGoals_createMutation()
  const updateMutation = useGoals_updateMutation()

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      targetAmount: defaultValues?.targetAmount ?? 0,
      currentAmount: defaultValues?.currentAmount ?? 0,
      deadline: defaultValues?.deadline ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: defaultValues?.name ?? '',
      targetAmount: defaultValues?.targetAmount ?? 0,
      currentAmount: defaultValues?.currentAmount ?? 0,
      deadline: defaultValues?.deadline ?? '',
    })
  }, [defaultValues, form])

  const onSubmit = (values: GoalFormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: defaultValues.id, data: values },
        { onSuccess }
      )
    } else {
      createMutation.mutate(values, { onSuccess })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Goal name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount</FormLabel>
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
        <FormField
          control={form.control}
          name="currentAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Amount (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline (optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save changes' : 'Create goal'}
        </Button>
      </form>
    </Form>
  )
}
