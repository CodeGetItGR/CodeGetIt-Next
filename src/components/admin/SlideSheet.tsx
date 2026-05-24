import { useEffect, type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface SlideSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    className?: string;
}

export const SlideSheet = ({ isOpen, onClose, title, description, className, children }: PropsWithChildren<SlideSheetProps>) => {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            {/* Panel */}
            <aside
                className={cn('relative ml-auto flex h-full w-full max-w-lg flex-col bg-white shadow-2xl', className)}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="mt-0.5 ml-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            </aside>
        </div>
    );
};
