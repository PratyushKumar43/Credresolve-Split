'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useApi } from '@/lib/api-client'

interface Expense {
  id: string
  amount: number
  description: string
  paidBy: {
    id: string
    name: string
  }
  splitType: 'equal' | 'exact' | 'percentage'
  createdAt: string
}

interface ExpenseListProps {
  groupId: string
}

export default function ExpenseList({ groupId }: ExpenseListProps) {
  const api = useApi()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  const fetchExpenses = async () => {
    try {
      const data = await api.get<any[]>(`/api/expenses/groups/${groupId}`)
      // Ensure amounts are numbers
      const expenses = data.map(expense => ({
        ...expense,
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount
      }))
      setExpenses(expenses)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (expenseId: string) => {
    try {
      await api.delete(`/api/expenses/${expenseId}`)
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <Skeleton className="h-6 w-20" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : expenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No expenses yet</p>
            <Link href={`/groups/${groupId}/expenses/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Expense
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{expense.description}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {expense.splitType}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Paid by {expense.paidBy.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(expense.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">Rs {Number(expense.amount).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/groups/${groupId}/expenses/${expense.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

