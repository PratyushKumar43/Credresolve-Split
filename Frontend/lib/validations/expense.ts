import { z } from 'zod'

export const expenseFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  paidBy: z.string().min(1, 'Please select who paid'),
  splitType: z.enum(['equal', 'exact', 'percentage']),
  memberIds: z.array(z.string()).min(1, 'Select at least one member'),
  exactSplits: z.record(z.number()).optional(),
  percentageSplits: z.record(z.number()).optional(),
}).refine((data) => {
  if (data.splitType === 'exact') {
    const total = Object.values(data.exactSplits || {}).reduce((a, b) => a + b, 0)
    return Math.abs(total - data.amount) < 0.01
  }
  return true
}, {
  message: 'Exact amounts must sum to expense total',
  path: ['exactSplits'],
}).refine((data) => {
  if (data.splitType === 'percentage') {
    const total = Object.values(data.percentageSplits || {}).reduce((a, b) => a + b, 0)
    return Math.abs(total - 100) < 0.01
  }
  return true
}, {
  message: 'Percentages must sum to 100',
  path: ['percentageSplits'],
})



