'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, ArrowRight } from 'lucide-react'
import { useApi } from '@/lib/api-client'
import { useAuth } from '@clerk/nextjs'
import { useToast } from '@/components/ui/use-toast'

interface SimplifiedBalance {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
}

interface BalanceCardProps {
  groupId: string
}

export default function BalanceCard({ groupId }: BalanceCardProps) {
  const api = useApi()
  const { userId } = useAuth()
  const { toast } = useToast()
  const [balances, setBalances] = useState<SimplifiedBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBalances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  const fetchBalances = async () => {
    try {
      const data = await api.get<SimplifiedBalance[]>(`/api/balances/groups/${groupId}/simplified`)
      setBalances(data)
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettle = async (from: string, to: string, amount: number) => {
    if (!userId) {
      console.error('User not authenticated')
      return
    }

    // Only allow settlement if current user is the one who owes (from)
    if (userId !== from) {
      console.error('You can only settle debts you owe')
      return
    }

    try {
      await api.post('/api/settlements', {
        groupId,
        paidBy: from, // Current user (who owes)
        paidTo: to,   // Person being paid
        amount,
      })
      
      toast({
        title: 'Settlement recorded',
        description: `You've settled Rs ${amount.toFixed(2)} with ${balances.find(b => b.to === to)?.toName || 'the recipient'}.`,
      })
      
      // Refresh balances after a short delay to ensure backend has processed
      setTimeout(() => {
        fetchBalances()
      }, 500)
    } catch (error: any) {
      console.error('Error settling:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to record settlement',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simplified Balances</CardTitle>
        <CardDescription>
          Who owes whom in this group
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 border rounded-lg">
                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                  <div className="text-center min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded shrink-0" />
                  <div className="text-center min-w-0 flex-1">
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : balances.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            All settled up! No outstanding balances.
          </p>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 border rounded-lg"
              >
                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                  <div className="text-center min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{balance.fromName}</p>
                    <p className="text-xs text-muted-foreground">owes</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="text-center min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{balance.toName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-base md:text-lg font-bold">Rs {balance.amount.toFixed(2)}</p>
                  </div>
                  {userId && userId === balance.from ? (
                    <Button
                      size="sm"
                      onClick={() => handleSettle(balance.from, balance.to, balance.amount)}
                      className="w-full sm:w-auto"
                    >
                      Settle
                    </Button>
                  ) : userId ? (
                    <p className="text-xs text-muted-foreground text-center sm:text-right">
                      Waiting for {balance.fromName} to settle
                    </p>
                  ) : (
                    <Skeleton className="h-9 w-20 rounded" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

