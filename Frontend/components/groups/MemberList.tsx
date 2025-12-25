'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserPlus, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useApi } from '@/lib/api-client'

interface Member {
  id: string
  name: string
  email: string
}

interface MemberListProps {
  groupId: string
  members: Member[]
  onUpdate: () => void
}

export default function MemberList({ groupId, members, onUpdate }: MemberListProps) {
  const api = useApi()
  const [email, setEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddMember = async () => {
    const trimmedEmail = email.trim()
    
    if (!trimmedEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      })
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    // Check if member already exists
    if (members.some(m => m.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      toast({
        title: 'Error',
        description: 'This user is already a member of the group',
        variant: 'destructive',
      })
      return
    }

    setIsAdding(true)
    try {
      await api.post(`/api/groups/${groupId}/members`, { email: trimmedEmail })
      toast({
        title: 'Success',
        description: 'Member added successfully',
      })
      setEmail('')
      onUpdate()
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add member'
      toast({
        title: 'Error',
        description: errorMessage.includes('not found') 
          ? 'User not found. They need to sign up first.'
          : errorMessage.includes('already a member')
          ? 'This user is already a member'
          : errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      await api.delete(`/api/groups/${groupId}/members/${userId}`)
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      })
      onUpdate()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage group members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAdding) {
                handleAddMember()
              }
            }}
            disabled={isAdding}
            className="flex-1"
          />
          <Button 
            onClick={handleAddMember} 
            disabled={isAdding || !email.trim()}
            className="w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          The user must have an account with this email address to be added.
        </p>

        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No members yet. Add members by their email address.
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <Avatar className="shrink-0">
                    <AvatarFallback>
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{member.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

