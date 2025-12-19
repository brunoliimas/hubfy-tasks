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

export const tasksApi = {
    list: () => apiRequest<{ tasks: Task[] }>('/tasks'),

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