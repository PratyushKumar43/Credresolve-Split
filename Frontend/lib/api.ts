import { auth } from '@clerk/nextjs/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const { getToken } = await auth()
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

export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'GET' })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }
  return response.json()
}

export async function apiPost<T = any>(endpoint: string, data?: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }
  return response.json()
}

export async function apiPut<T = any>(endpoint: string, data?: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }
  return response.json()
}

export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'DELETE' })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }
  return response.json()
}

// Client-side API utility (for use in client components)
export const clientApi = {
  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })
  },

  async get<T = any>(endpoint: string): Promise<T> {
    const response = await this.request(endpoint, { method: 'GET' })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }
    return response.json()
  },

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }
    return response.json()
  },

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }
    return response.json()
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.request(endpoint, { method: 'DELETE' })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }
    return response.json()
  },
}



