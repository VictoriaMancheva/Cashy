import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Category, CategoryFormValues } from '@/features/categories/consts/categories_schemas'
import { CategoryFormSchema } from '@/features/categories/consts/categories_schemas'
import { useCategories_createMutation } from '@/features/categories/hooks/useCategories_createMutation'
import { useCategories_updateMutation } from '@/features/categories/hooks/useCategories_updateMutation'

type Props = {
  defaultValues?: Category | null
  onSuccess: () => void
}

export const Categories_Form = ({ defaultValues, onSuccess }: Props) => {
  const isEditing = defaultValues != null

  const createMutation = useCategories_createMutation()
  const updateMutation = useCategories_updateMutation()

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: { name: defaultValues?.name ?? '' },
  })

  useEffect(() => {
    form.reset({ name: defaultValues?.name ?? '' })
  }, [defaultValues, form])

  const onSubmit = (values: CategoryFormValues) => {
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
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save changes' : 'Create category'}
        </Button>
      </form>
    </Form>
  )
}
