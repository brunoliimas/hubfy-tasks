interface PaginationProps {
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, hasNext, hasPrev, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!hasPrev}
                className="px-3 py-1.5 text-sm rounded-btn border border-supporting-border-gray 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-supporting-background transition-colors cursor-pointer
                           text-label"
            >
                Anterior
            </button>

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`w-8 h-8 text-sm rounded-btn transition-colors cursor-pointer
                            ${pageNum === page
                                ? 'bg-primary-ui-blue text-white'
                                : 'hover:bg-supporting-background text-label'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!hasNext}
                className="px-3 py-1.5 text-sm rounded-btn border border-supporting-border-gray
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-supporting-background transition-colors cursor-pointer
                           text-label"
            >
                Próximo
            </button>
        </div>
    )
}