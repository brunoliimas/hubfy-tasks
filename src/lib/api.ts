const API_URL = '/api'

function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken()

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    }

    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição')
    }

    return data
}

export const authApi = {
    register: (data: { name: string; email: string; password: string }) =>
        apiRequest<{ message: string; user: { id: number; name: string; email: string } }>(
            '/auth/register',
            { method: 'POST', body: JSON.stringify(data) }
        ),

    login: (data: { email: string; password: string }) =>
        apiRequest<{ token: string; user: { id: number; name: string; email: string } }>(
            '/auth/login',
            { method: 'POST', body: JSON.stringify(data) }
        ),
}

export interface Task {
    id: number
    title: string
    description: string | null
    status: 'pending' | 'in_progress' | 'completed'
    createdAt: string
    updatedAt: string
}

export interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface TasksResponse {
    tasks: Task[]
    pagination: Pagination
}

export interface TaskListParams {
    page?: number
    limit?: number
    status?: string
}

export const tasksApi = {
    list: (params?: TaskListParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set('page', params.page.toString())
        if (params?.limit) searchParams.set('limit', params.limit.toString())
        if (params?.status) searchParams.set('status', params.status)

        const query = searchParams.toString()
        return apiRequest<TasksResponse>(`/tasks${query ? `?${query}` : ''}`)
    },

    create: (data: { title: string; description?: string; status?: string }) =>
        apiRequest<{ task: Task }>('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: number, data: { title?: string; description?: string; status?: string }) =>
        apiRequest<{ task: Task }>(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiRequest<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),
}