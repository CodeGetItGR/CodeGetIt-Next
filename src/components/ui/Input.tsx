import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
            <input
                ref={ref}
                className={`w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none ${className}`}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';
