'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Users, DollarSign, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ExpenseList from '@/components/expenses/ExpenseList'
import BalanceCard from '@/components/balances/BalanceCard'
import MemberList from '@/components/groups/MemberList'
import GroupSettings from '@/components/groups/GroupSettings'
import { useApi } from '@/lib/api-client'

interface Group {
  id: string
  name: string
  description: string | null
  members: Array<{
    id: string
    name: string
    email: string
    role?: string
  }>
  userRole: string | null
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const api = useApi()
  const groupId = params.id as string
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  const fetchGroup = async () => {
    try {
      const data = await api.get<Group>(`/api/groups/${groupId}`)
      setGroup(data)
    } catch (error) {
      console.error('Error fetching group:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!group && !isLoading) {
    return <div>Group not found</div>
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {isLoading ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expenses" className="text-xs sm:text-sm">Expenses</TabsTrigger>
              <TabsTrigger value="balances" className="text-xs sm:text-sm">Balances</TabsTrigger>
              <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
            </TabsList>
            <TabsContent value="expenses" className="space-y-4">
              <div className="space-y-4">
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
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight truncate">{group!.name}</h1>
                {group!.description && (
                  <p className="text-sm md:text-base text-muted-foreground truncate">{group!.description}</p>
                )}
              </div>
              {group!.userRole === 'admin' && (
                <GroupSettings
                  groupId={groupId}
                  groupName={group!.name}
                  groupDescription={group!.description}
                  isAdmin={true}
                  onUpdate={fetchGroup}
                />
              )}
            </div>
            <Link href={`/groups/${groupId}/expenses/new`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expenses" className="text-xs sm:text-sm">Expenses</TabsTrigger>
              <TabsTrigger value="balances" className="text-xs sm:text-sm">Balances</TabsTrigger>
              <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <ExpenseList groupId={groupId} />
            </TabsContent>

            <TabsContent value="balances" className="space-y-4">
              <BalanceCard groupId={groupId} />
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <MemberList groupId={groupId} members={group!.members} onUpdate={fetchGroup} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

