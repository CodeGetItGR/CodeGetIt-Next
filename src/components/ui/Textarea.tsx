import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
            <textarea
                ref={ref}
                className={`w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none ${className}`}
                {...props}
            />
        </div>
    );
});

Textarea.displayName = 'Textarea';
