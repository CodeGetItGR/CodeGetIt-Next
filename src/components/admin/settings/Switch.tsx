import type { ChangeEvent } from 'react';
import { cn } from '@/lib/utils.ts';

export const Switch = ({
    checked,
    disabled,
    onChange,
    inputProps,
}: {
    checked: boolean;
    disabled?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    inputProps?: Record<string, string>;
}) => (
    <label className="inline-flex cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only" {...inputProps} />

        <span className={cn('relative h-7 w-12 rounded-full transition-colors duration-300', checked ? 'bg-slate-900' : 'bg-gray-300')}>
            <span
                className={cn(
                    'absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300',
                    checked ? 'translate-x-5' : 'translate-x-0'
                )}
            />
        </span>
    </label>
);
