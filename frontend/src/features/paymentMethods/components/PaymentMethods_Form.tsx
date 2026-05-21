import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { PaymentMethod, PaymentMethodFormValues } from '@/features/paymentMethods/consts/paymentMethods_schemas'
import { PaymentMethodFormSchema } from '@/features/paymentMethods/consts/paymentMethods_schemas'
import { usePaymentMethods_createMutation } from '@/features/paymentMethods/hooks/usePaymentMethods_createMutation'
import { usePaymentMethods_updateMutation } from '@/features/paymentMethods/hooks/usePaymentMethods_updateMutation'

type Props = {
  defaultValues?: PaymentMethod | null
  onSuccess: () => void
}

export const PaymentMethods_Form = ({ defaultValues, onSuccess }: Props) => {
  const isEditing = defaultValues != null

  const createMutation = usePaymentMethods_createMutation()
  const updateMutation = usePaymentMethods_updateMutation()

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(PaymentMethodFormSchema),
    defaultValues: { name: defaultValues?.name ?? '' },
  })

  useEffect(() => {
    form.reset({ name: defaultValues?.name ?? '' })
  }, [defaultValues, form])

  const onSubmit = (values: PaymentMethodFormValues) => {
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
                <Input placeholder="Payment method name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save changes' : 'Create payment method'}
        </Button>
      </form>
    </Form>
  )
}
