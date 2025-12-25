'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { expenseFormSchema } from '@/lib/validations/expense'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useApi } from '@/lib/api-client'

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

interface Member {
  id: string
  name: string
  email: string
}

export default function NewExpensePage() {
  const params = useParams()
  const router = useRouter()
  const api = useApi()
  const groupId = params.id as string
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      splitType: 'equal',
      memberIds: [],
    },
  })

  const splitType = watch('splitType')
  const selectedMembers = watch('memberIds')
  const amount = watch('amount')

  useEffect(() => {
    fetchMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  const fetchMembers = async () => {
    try {
      const data = await api.get<{ members: Member[] }>(`/api/groups/${groupId}`)
      setMembers(data.members || [])
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const toggleMember = (memberId: string) => {
    const current = watch('memberIds')
    if (current.includes(memberId)) {
      setValue('memberIds', current.filter((id) => id !== memberId))
    } else {
      setValue('memberIds', [...current, memberId])
    }
  }

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsLoading(true)
    try {
      let splits: any[] = []

      if (data.splitType === 'equal') {
        splits = data.memberIds.map((userId) => ({ userId }))
      } else if (data.splitType === 'exact') {
        splits = Object.entries(data.exactSplits || {}).map(([userId, amount]) => ({
          userId,
          amount: Number(amount),
        }))
      } else {
        splits = Object.entries(data.percentageSplits || {}).map(([userId, percentage]) => ({
          userId,
          percentage: Number(percentage),
        }))
      }

      await api.post(`/api/expenses/groups/${groupId}`, {
        amount: data.amount,
        description: data.description,
        paidBy: data.paidBy,
        splitType: data.splitType,
        splits,
      })

      toast({
        title: 'Success',
        description: 'Expense added successfully',
      })
      router.push(`/groups/${groupId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Add Expense</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Add a new expense to this group
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            Enter the expense information and how to split it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner, Groceries, Gas"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid By *</Label>
              <Select onValueChange={(value) => setValue('paidBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paidBy && (
                <p className="text-sm text-destructive">{errors.paidBy.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Split Type *</Label>
              <div className="flex flex-wrap gap-2 md:gap-4">
                <Button
                  type="button"
                  variant={splitType === 'equal' ? 'default' : 'outline'}
                  onClick={() => setValue('splitType', 'equal')}
                  className="flex-1 sm:flex-initial"
                >
                  Equal
                </Button>
                <Button
                  type="button"
                  variant={splitType === 'exact' ? 'default' : 'outline'}
                  onClick={() => setValue('splitType', 'exact')}
                  className="flex-1 sm:flex-initial"
                >
                  Exact
                </Button>
                <Button
                  type="button"
                  variant={splitType === 'percentage' ? 'default' : 'outline'}
                  onClick={() => setValue('splitType', 'percentage')}
                  className="flex-1 sm:flex-initial"
                >
                  Percentage
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Members *</Label>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={member.id}
                      checked={selectedMembers?.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="rounded"
                    />
                    <label htmlFor={member.id} className="text-sm font-medium">
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
              {errors.memberIds && (
                <p className="text-sm text-destructive">{errors.memberIds.message}</p>
              )}
            </div>

            {splitType === 'exact' && amount && selectedMembers && selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Exact Amounts</Label>
                {selectedMembers.map((memberId) => {
                  const member = members.find((m) => m.id === memberId)
                  return (
                    <div key={memberId} className="flex items-center gap-2">
                      <Label className="flex-1">{member?.name}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`exactSplits.${memberId}` as const, { 
                          valueAsNumber: true,
                          required: true 
                        })}
                        className="w-32"
                      />
                    </div>
                  )
                })}
                {errors.exactSplits && (
                  <p className="text-sm text-destructive">
                    {typeof errors.exactSplits === 'object' && 'message' in errors.exactSplits
                      ? String(errors.exactSplits.message)
                      : 'Exact amounts must sum to expense total'}
                  </p>
                )}
              </div>
            )}

            {splitType === 'percentage' && selectedMembers && selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Percentages</Label>
                {selectedMembers.map((memberId) => {
                  const member = members.find((m) => m.id === memberId)
                  return (
                    <div key={memberId} className="flex items-center gap-2">
                      <Label className="flex-1">{member?.name}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...register(`percentageSplits.${memberId}` as const, { 
                          valueAsNumber: true,
                          required: true 
                        })}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  )
                })}
                {errors.percentageSplits && (
                  <p className="text-sm text-destructive">
                    {typeof errors.percentageSplits === 'object' && 'message' in errors.percentageSplits
                      ? String(errors.percentageSplits.message)
                      : 'Percentages must sum to 100'}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Adding...' : 'Add Expense'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

