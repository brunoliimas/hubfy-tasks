'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { tasksApi, Task } from '@/lib/api'
import TaskCard from '@/components/TaskCard'
import TaskForm from '@/components/TaskForm'
import TaskFilter from '@/components/TaskFilter'

export default function DashboardPage() {
    const { user, isLoading: isAuthLoading, logout } = useAuth()
    const router = useRouter()
    const [tasks, setTasks] = useState<Task[]>([])
    const [filter, setFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState('')

    const safeTasks = tasks || []

    useEffect(() => {
        if (isAuthLoading) return

        const token = localStorage.getItem('token')

        if (!token) {
            router.push('/login')
            return
        }

        async function loadTasks() {
            try {
                const response = await tasksApi.list()
                setTasks(response.tasks)
                setError('')
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
            } finally {
                setIsLoading(false)
            }
        }

        loadTasks()
    }, [isAuthLoading, router])

    const handleCreate = async (data: { title: string; description: string; status?: 'pending' | 'in_progress' | 'completed' }) => {
        setIsCreating(true)
        try {
            const response = await tasksApi.create(data)
            setTasks((prev) => [response.task, ...(prev || [])])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar tarefa')
        } finally {
            setIsCreating(false)
        }
    }

    const handleUpdate = async (id: number, data: { title?: string; description?: string; status?: string }) => {
        try {
            const response = await tasksApi.update(id, data)
            setTasks((prev) => prev.map((task) => (task.id === id ? response.task : task)))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await tasksApi.delete(id)
            setTasks((prev) => prev.filter((task) => task.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir tarefa')
        }
    }

    const filteredTasks = safeTasks.filter((task) => {
        if (filter === 'all') return true
        return task.status === filter
    })

    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-main">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-ui-blue border-r-transparent"></div>
                    <p className="mt-2 text-value">Carregando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg-main">
            <header className="bg-bg-card shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-label">Hubfy Tasks</h1>
                        <p className="text-sm text-value">Olá, {user?.name}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm text-value hover:text-label hover:bg-supporting-background rounded-btn transition-colors cursor-pointer"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
                        {error}
                        <button onClick={() => setError('')} className="ml-2 underline">
                            Fechar
                        </button>
                    </div>
                )}

                <div className="mb-6">
                    <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
                </div>

                <div className="mb-6">
                    <TaskForm onSubmit={handleCreate} isLoading={isCreating} />
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-value">
                            {filter === 'all'
                                ? 'Nenhuma tarefa encontrada. Crie sua primeira tarefa!'
                                : `Nenhuma tarefa ${filter === 'pending' ? 'pendente' : filter === 'in_progress' ? 'em progresso' : 'concluída'}.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-value">
                    {safeTasks.length} tarefa{safeTasks.length !== 1 ? 's' : ''} no total
                </div>
            </main>
        </div>
    )
}