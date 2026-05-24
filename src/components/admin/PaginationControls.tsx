interface PaginationControlsProps {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}

export const PaginationControls = ({ page, totalPages, onPrevious, onNext }: PaginationControlsProps) => {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{page + 1}</span> of{' '}
                <span className="font-semibold text-gray-900">{Math.max(totalPages, 1)}</span>
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={page <= 0}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={totalPages === 0 || page >= totalPages - 1}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
