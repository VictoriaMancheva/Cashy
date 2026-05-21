import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Budget, BudgetFormValues } from '@/features/budgets/consts/budgets_schemas'
import { BudgetFormSchema } from '@/features/budgets/consts/budgets_schemas'
import { useBudgets_createMutation } from '@/features/budgets/hooks/useBudgets_createMutation'
import { useBudgets_updateMutation } from '@/features/budgets/hooks/useBudgets_updateMutation'
import { useSharedCategories } from '@/hooks/useSharedCategories'
import { CURRENT_YEAR, MONTHS, SELECT_NONE } from '@/utils/formatters'

type Props = {
  defaultValues?: Budget | null
  onSuccess: () => void
}

export const Budgets_Form = ({ defaultValues, onSuccess }: Props) => {
  const { data: categories } = useSharedCategories()
  const createMutation = useBudgets_createMutation()
  const updateMutation = useBudgets_updateMutation()
  const [newCatId, setNewCatId] = useState<string>(SELECT_NONE)

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(BudgetFormSchema),
    defaultValues: {
      totalAmount: defaultValues?.totalAmount ?? 0,
      month: defaultValues?.month ?? new Date().getMonth() + 1,
      year: defaultValues?.year ?? CURRENT_YEAR,
      categories: defaultValues?.categories.map((c) => ({
        categoryId: c.categoryId,
        limitAmount: c.limitAmount,
      })) ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'categories' })

  useEffect(() => {
    form.reset({
      totalAmount: defaultValues?.totalAmount ?? 0,
      month: defaultValues?.month ?? new Date().getMonth() + 1,
      year: defaultValues?.year ?? CURRENT_YEAR,
      categories: defaultValues?.categories.map((c) => ({
        categoryId: c.categoryId,
        limitAmount: c.limitAmount,
      })) ?? [],
    })
  }, [defaultValues, form])

  const handleAddCategory = () => {
    if (newCatId === SELECT_NONE) return
    append({ categoryId: Number(newCatId), limitAmount: 0 })
    setNewCatId(SELECT_NONE)
  }

  const onSubmit = (values: BudgetFormValues) => {
    if (defaultValues?.id != null) {
      updateMutation.mutate({ id: defaultValues.id, data: values }, { onSuccess })
    } else {
      createMutation.mutate(values, { onSuccess })
    }
  }

  const usedCategoryIds = new Set(fields.map((f) => f.categoryId))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Budget</FormLabel>
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
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
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
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={String(CURRENT_YEAR)}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Category Limits</FormLabel>
          {fields.map((field, index) => {
            const cat = categories?.find((c) => c.id === field.categoryId)
            return (
              <div key={field.id} className="flex items-center gap-2">
                <span className="flex-1 text-sm">{cat?.name ?? `Category ${field.categoryId}`}</span>
                <FormField
                  control={form.control}
                  name={`categories.${index}.limitAmount`}
                  render={({ field: f }) => (
                    <FormItem className="w-28">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...f}
                          onChange={(e) => f.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )
          })}

          <div className="flex items-center gap-2">
            <Select value={newCatId} onValueChange={setNewCatId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add category limit..." />
              </SelectTrigger>
              <SelectContent>
                {categories
                  ?.filter((c) => !usedCategoryIds.has(c.id))
                  .map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="icon" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues != null ? 'Save Changes' : 'Create Budget'}
        </Button>
      </form>
    </Form>
  )
}
