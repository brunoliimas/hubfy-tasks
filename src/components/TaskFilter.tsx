'use client'

interface TaskFilterProps {
    currentFilter: string
    onFilterChange: (filter: string) => void
}

export default function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
    const filters = [
        { value: 'all', label: 'Todas' },
        { value: 'pending', label: 'Pendentes' },
        { value: 'in_progress', label: 'Em Progresso' },
        { value: 'completed', label: 'Concluídas' },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    className={`${currentFilter === filter.value ? 'btn-filter-primary' : 'btn-filter-secondary'}`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    )
}