'use client'

import { cn } from '@/lib';
import { RotateCcw } from 'lucide-react';
import type { Translations } from '@/i18n/types.ts';
import {formatFieldValue, INPUT_CLASS, SettingDefinition, Switch} from "@/components";

const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-[110px] resize-y`;

export const SettingsField = ({
    definition,
    value,
    defaultValue,
    dirty,
    disabled,
    onChange,
    onReset,
    copy,
    selectOptions,
}: {
    definition: SettingDefinition;
    value: string;
    defaultValue: string;
    dirty: boolean;
    disabled?: boolean;
    onChange: (key: string, value: string) => void;
    onReset: (key: string) => void;
    copy: Translations['admin']['settings'];
    selectOptions?: readonly string[];
}) => {
    const fieldStateClass = dirty ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200 bg-gray-50/40';
    const controlClass = dirty ? 'border-amber-300 bg-amber-50/40' : '';
    const isToggle = definition.control === 'toggle';

    const controlNode = isToggle ? null : (
        definition.control === 'textarea' ? (
            <textarea
                value={value}
                rows={4}
                disabled={disabled}
                onChange={(event) => onChange(definition.key, event.currentTarget.value)}
                className={cn(TEXTAREA_CLASS, controlClass)}
            />
        ) : definition.control === 'select' ? (
            <select
                value={value || selectOptions?.[0] || 'INFO'}
                disabled={disabled}
                onChange={(event) => onChange(definition.key, event.currentTarget.value)}
                className={cn(INPUT_CLASS, controlClass)}
            >
                {(selectOptions ?? definition.options ?? []).map((optionValue) => (
                    <option key={optionValue} value={optionValue}>
                        {optionValue}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type={definition.control === 'number' ? 'number' : (definition.inputType ?? 'text')}
                inputMode={definition.control === 'number' ? 'numeric' : undefined}
                step={definition.control === 'number' ? 1 : undefined}
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(definition.key, event.currentTarget.value)}
                className={cn(INPUT_CLASS, controlClass)}
            />
        )
    );

    return (
        <div className={cn('rounded-2xl border p-4 transition', fieldStateClass, disabled && 'opacity-70')}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-gray-900">{definition.label}</p>
                    {definition.description ? <p className="mt-1 text-xs leading-5 text-gray-500">{definition.description}</p> : null}
                    <p className="mt-2 text-xs text-gray-500">
                        {copy.states.defaultLabel}: {formatFieldValue(definition, defaultValue, copy)}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium',
                            dirty ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                        )}
                    >
                        {dirty ? copy.states.modified : copy.states.saved}
                    </span>
                    {isToggle && (
                        <Switch
                            checked={value === 'true'}
                            disabled={disabled}
                            onChange={(event) => onChange(definition.key, event.currentTarget.checked ? 'true' : 'false')}
                        />
                    )}
                </div>
            </div>

            {controlNode && <div className="mt-4">{controlNode}</div>}

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500">{copy.states.changesRemainHint}</p>
                <button
                    type="button"
                    onClick={() => onReset(definition.key)}
                    disabled={disabled || !dirty}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {copy.states.resetToDefault}
                </button>
            </div>
        </div>
    );
};
