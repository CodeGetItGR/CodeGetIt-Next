'use client'

import type { ChangeEvent } from 'react';
import { cn } from '@/lib';
import type { Translations } from '@/i18n/types.ts';
import { Switch } from '@/components';
import type { SettingsOptionGroup } from '@/api';

export const RequestOptionsGroup = ({
    group,
    disabled,
    onToggle,
    copy,
}: {
    group: SettingsOptionGroup;
    disabled?: boolean;
    onToggle: (event: ChangeEvent<HTMLInputElement>) => void;
    copy: Translations['admin']['settings'];
}) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-4 py-3">
            <div>
                <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                    {group.items.filter((item) => item.enabled).length} {copy.states.enabled} of {group.items.length}
                </p>
            </div>

            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600">
                {copy.states.groupKeyLabel}: {group.key}
            </span>
        </div>

        <table className="min-w-full divide-y divide-gray-100">
            <tbody className="divide-y divide-gray-100">
                {group.items.map((item) => (
                    <tr key={item.value} className={cn('transition', !item.enabled && 'bg-gray-50/60')}>
                        <td className="px-4 py-3">
                            <p className={cn('text-sm font-medium', item.enabled ? 'text-gray-900' : 'text-gray-500')}>{item.label}</p>
                            <p className="text-xs text-gray-400">{item.value}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <Switch
                                checked={item.enabled}
                                disabled={disabled}
                                onChange={onToggle}
                                inputProps={{
                                    'data-group-key': group.key,
                                    'data-option-value': item.value,
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
