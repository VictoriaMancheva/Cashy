import { apiClient } from '@/api/client'
import { RECEIPTS_ENDPOINTS } from '@/features/transactions/consts/receipts_endpoints'
import type { ReceiptScanResult } from '@/features/transactions/consts/transactions_schemas'
import { ReceiptScanResultSchema } from '@/features/transactions/consts/transactions_schemas'

export const transactions_scanReceipt = (file: File): Promise<ReceiptScanResult> => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient
    .post<unknown>(RECEIPTS_ENDPOINTS.scan, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => ReceiptScanResultSchema.parse(res.data))
}
