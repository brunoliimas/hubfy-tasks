'use client'

import { useState } from 'react'
import { Task } from '@/lib/api'

interface TaskCardProps {
    task: Task
    onUpdate: (id: number, data: { title?: string; description?: string; status?: 'pending' | 'in_progress' | 'completed' }) => Promise<void>
    onDelete: (id: number) => Promise<void>
}

const getStatusSelectClass = (status: string) => {
    switch (status) {
        case 'pending':
            return 'select-status-pending'
        case 'in_progress':
            return 'select-status-in-progress'
        case 'completed':
            return 'select-status-completed'
        default:
            return 'select-status'
    }
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description || '')
    const [status, setStatus] = useState(task.status)

    const handleSave = async () => {
        setIsLoading(true)
        await onUpdate(task.id, { title, description, status })
        setIsLoading(false)
        setIsEditing(false)
    }

    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            setIsLoading(true)
            await onDelete(task.id)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true)
        setStatus(newStatus as 'pending' | 'in_progress' | 'completed')
        await onUpdate(task.id, { status: newStatus as 'pending' | 'in_progress' | 'completed' })
        setIsLoading(false)
    }

    if (isEditing) {
        return (
            <div className="card-compact">
                <div className="space-y-4">
                    <div>
                        <label className="label">
                            Título
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">
                            Descrição
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="textarea"
                        />
                    </div>

                    <div>
                        <label className="label">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Task['status'])}
                            className="select"
                        >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 btn-primary"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                        onClick={() => {
                            setTitle(task.title)
                            setDescription(task.description || '')
                            setStatus(task.status)
                            setIsEditing(false)
                        }}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="card-compact">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-label">{task.title}</h3>
                    {task.description && (
                        <p className="text-value mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={isLoading}
                            className={getStatusSelectClass(task.status)}
                        >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                        </select>
                        <span className="text-xs text-value">
                            {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-icon-primary"
                        title="Editar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="btn-icon-danger"
                        title="Excluir"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}