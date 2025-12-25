'use client'

import { useAuth } from '@clerk/nextjs'
import { useMemo } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function useApi() {
  const { getToken } = useAuth()

  const api = useMemo(() => {
    const request = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
      const token = await getToken()
      const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      }

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      })
    }

    const get = async <T = any>(endpoint: string): Promise<T> => {
      const response = await request(endpoint, { method: 'GET' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || error.message || 'Request failed')
      }
      return response.json()
    }

    const post = async <T = any>(endpoint: string, data?: any): Promise<T> => {
      const response = await request(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || error.message || 'Request failed')
      }
      return response.json()
    }

    const put = async <T = any>(endpoint: string, data?: any): Promise<T> => {
      const response = await request(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || error.message || 'Request failed')
      }
      return response.json()
    }

    const del = async <T = any>(endpoint: string): Promise<T> => {
      const response = await request(endpoint, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || error.message || 'Request failed')
      }
      return response.json()
    }

    return { get, post, put, delete: del }
  }, [getToken])

  return api
}

