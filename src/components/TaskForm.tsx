'use client'

import { useState } from 'react'

interface TaskFormProps {
    onSubmit: (data: { title: string; description: string; status?: 'pending' | 'in_progress' | 'completed' }) => Promise<void>
    isLoading: boolean
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending')
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit({ title, description, status })
        setTitle('')
        setDescription('')
        setStatus('pending')
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full cursor-pointer py-3 border-2 border-dashed border-supporting-border-gray rounded-btn text-value hover:border-supporting-secondary-blue hover:text-supporting-secondary-blue transition-colors"
            >
                + Nova Tarefa
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="card-compact">
            <h3 className="text-lg font-bold text-label mb-4">Nova Tarefa</h3>

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="label">
                        Título *
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="input"
                        placeholder="Digite o título da tarefa"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="label">
                        Descrição
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="textarea"
                        placeholder="Digite uma descrição (opcional)"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="label">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
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
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-primary"
                >
                    {isLoading ? 'Criando...' : 'Criar Tarefa'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}