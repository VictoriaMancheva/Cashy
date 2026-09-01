import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { transactions_scanReceipt } from '@/features/transactions/api/transactions_scanReceipt'
import type { ReceiptScanResult } from '@/features/transactions/consts/transactions_schemas'

export const useTransactions_scanReceiptMutation = (): UseMutationResult<ReceiptScanResult, Error, File> =>
  useMutation({
    mutationFn: transactions_scanReceipt,
  })
