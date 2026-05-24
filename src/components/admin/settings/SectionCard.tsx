import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {PANEL_CLASS} from "@/components";

export const SectionCard = ({
    title,
    description,
    icon: Icon,
    count,
    sectionLabel,
    fieldLabel,
    children,
    accentClassName,
}: {
    title: string;
    description: string;
    icon: LucideIcon;
    count: number;
    sectionLabel: string;
    fieldLabel: string;
    children: ReactNode;
    accentClassName: string;
}) => (
    <section className={cn(PANEL_CLASS, 'overflow-hidden')}>
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-6">
            <div className="flex items-start gap-4">
                <div className={cn('rounded-2xl p-3', accentClassName)}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-medium tracking-[0.18em] text-gray-500 uppercase">{sectionLabel}</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-600">{description}</p>
                </div>
            </div>

            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                {count} {fieldLabel}
            </span>
        </div>

        <div className="border-t border-gray-100 px-6 py-6">{children}</div>
    </section>
);
