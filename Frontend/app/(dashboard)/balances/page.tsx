'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { useApi } from '@/lib/api-client'

interface BalanceSummary {
  totalOwed: number
  totalOwedToYou: number
  netBalance: number
}

export default function BalancesPage() {
  const api = useApi()
  const [summary, setSummary] = useState<BalanceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBalances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBalances = async () => {
    try {
      const data = await api.get<BalanceSummary>('/api/balances')
      setSummary(data)
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!summary && !isLoading) {
    return <div>No balance data available</div>
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Balances</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Overview of your expense balances
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                {i === 3 && <Skeleton className="h-3 w-32" />}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">You Owe</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                Rs {summary!.totalOwed.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Owed to You</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rs {summary!.totalOwedToYou.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  summary!.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {summary!.netBalance >= 0 ? '+' : ''}
                Rs {summary!.netBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary!.netBalance >= 0
                  ? 'You are owed money'
                  : 'You owe money'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

