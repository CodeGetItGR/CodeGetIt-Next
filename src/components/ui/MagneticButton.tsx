import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const MagneticButton = ({ children, className = '', onClick, type = 'button', ...props }: MagneticButtonProps) => {
    return (
        <button type={type} onClick={onClick} className={className} {...props}>
            {children}
        </button>
    );
};
