'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { tasksApi, Task, Pagination as PaginationType } from '@/lib/api'
import TaskCard from '@/components/TaskCard'
import TaskForm from '@/components/TaskForm'
import TaskFilter from '@/components/TaskFilter'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Pagination } from '@/components/Pagination'

export default function DashboardPage() {
    const { user, isLoading: isAuthLoading, logout } = useAuth()
    const router = useRouter()
    const [tasks, setTasks] = useState<Task[]>([])
    const [pagination, setPagination] = useState<PaginationType | null>(null)
    const [filter, setFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState('')

    const safeTasks = tasks || []

    const loadTasks = async (currentPage: number, currentFilter: string) => {
        try {
            setIsLoading(true)
            const response = await tasksApi.list({
                page: currentPage,
                limit: 4,
                status: currentFilter !== 'all' ? currentFilter : undefined
            })
            setTasks(response.tasks)
            setPagination(response.pagination)
            setError('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthLoading) return

        const token = localStorage.getItem('token')

        if (!token) {
            router.push('/login')
            return
        }

        loadTasks(page, filter)
    }, [isAuthLoading, router, page, filter])

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter)
        setPage(1) 
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleCreate = async (data: { title: string; description: string; status?: 'pending' | 'in_progress' | 'completed' }) => {
        setIsCreating(true)
        try {
            await tasksApi.create(data)
            
            await loadTasks(1, filter)
            setPage(1)
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
            await loadTasks(page, filter)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir tarefa')
        }
    }

    if (isAuthLoading) {
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
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm text-value hover:text-label hover:bg-supporting-background rounded-btn transition-colors cursor-pointer"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-6">
                        {error}
                        <button onClick={() => setError('')} className="ml-2 underline">
                            Fechar
                        </button>
                    </div>
                )}

                <div className="mb-6">
                    <TaskFilter currentFilter={filter} onFilterChange={handleFilterChange} />
                </div>

                <div className="mb-6">
                    <TaskForm onSubmit={handleCreate} isLoading={isCreating} />
                </div>

                {isLoading ? (
                    <div className="card text-center py-12">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary-ui-blue border-r-transparent"></div>
                        <p className="mt-2 text-value">Carregando tarefas...</p>
                    </div>
                ) : safeTasks.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-value">
                            {filter === 'all'
                                ? 'Nenhuma tarefa encontrada. Crie sua primeira tarefa!'
                                : `Nenhuma tarefa ${filter === 'pending' ? 'pendente' : filter === 'in_progress' ? 'em progresso' : 'concluída'}.`}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {safeTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {pagination && (
                            <Pagination
                                page={pagination.page}
                                totalPages={pagination.totalPages}
                                hasNext={pagination.hasNext}
                                hasPrev={pagination.hasPrev}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}

                <div className="mt-6 text-center text-sm text-value">
                    {pagination?.total || 0} tarefa{(pagination?.total || 0) !== 1 ? 's' : ''} no total
                </div>
            </main>
        </div>
    )
}