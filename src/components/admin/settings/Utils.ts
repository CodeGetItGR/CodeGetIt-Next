import { type AppSettingType } from '@/api';
import type { Translations } from '@/i18n/types.ts';
import { ArrowRight, DollarSign, Globe2, type LucideIcon, Mail, Megaphone, Sparkles } from 'lucide-react';

export const GROUP_ORDER: SettingGroup[] = ['Availability', 'Pricing', 'Marketing Hero', 'CTA', 'Banner', 'Contact'];
export const DEFAULT_BANNER_SEVERITIES = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const;
export type SettingGroup = 'Availability' | 'Pricing' | 'Marketing Hero' | 'CTA' | 'Banner' | 'Contact';
export type SettingControl = 'toggle' | 'text' | 'number' | 'select' | 'textarea';

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export const INPUT_CLASS =
    'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';
export const PANEL_CLASS = 'rounded-3xl border border-gray-200 bg-white shadow-sm';

export type SettingDefinition = {
    key: string;
    group: SettingGroup;
    type: AppSettingType;
    defaultValue: string | number;
    control: SettingControl;
    description?: string;
    inputType?: 'text' | 'email' | 'url';
    options?: readonly string[];
    label: string;
};

export const formatFieldValue = (definition: SettingDefinition, rawValue: string | number, copy: Translations['admin']['settings']) => {
    if (definition.control === 'toggle') {
        return `${rawValue}` === 'true' ? copy.states.enabled : copy.states.disabled;
    }

    if (definition.control === 'number') {
        return `€ ${NUMBER_FORMAT.format(Number(rawValue) || 0)}`;
    }

    return `${rawValue}` || '—';
};

export const fieldMatchesQuery = (definition: SettingDefinition, query: string) => {
    if (!query) {
        return true;
    }

    return [definition.key, definition.label, definition.group, definition.description ?? ''].join(' ').toLowerCase().includes(query);
};

export const optionGroupMatchesQuery = (group: { key: string; label: string; items: { value: string; label: string }[] }, query: string) => {
    if (!query) {
        return true;
    }

    return [group.key, group.label, ...group.items.flatMap((item) => [item.value, item.label])].join(' ').toLowerCase().includes(query);
};

export const BASE_DEFINITIONS: Omit<SettingDefinition, 'label'>[] = [
    {
        key: 'availability.acceptingProjects',
        group: 'Availability',
        type: 'BOOLEAN',
        defaultValue: 'true',
        control: 'toggle',
    },
    {
        key: 'availability.statusMessage',
        group: 'Availability',
        type: 'STRING',
        defaultValue: 'I am currently accepting new projects.',
        control: 'textarea',
        description: 'Shown when visitors need a quick status update.',
    },
    {
        key: 'availability.contactFormEnabled',
        group: 'Availability',
        type: 'BOOLEAN',
        defaultValue: 'true',
        control: 'toggle',
    },
    {
        key: 'availability.requestSubmissionEnabled',
        group: 'Availability',
        type: 'BOOLEAN',
        defaultValue: 'true',
        control: 'toggle',
    },
    {
        key: 'marketing.heroTitle',
        group: 'Marketing Hero',
        type: 'STRING',
        defaultValue: '',
        control: 'text',
        description: 'The strongest headline on the public marketing section.',
    },
    {
        key: 'marketing.heroSubtitle',
        group: 'Marketing Hero',
        type: 'STRING',
        defaultValue: '',
        control: 'textarea',
    },
    {
        key: 'marketing.ctaPrimaryText',
        group: 'CTA',
        type: 'STRING',
        defaultValue: 'Start a project',
        control: 'text',
    },
    {
        key: 'marketing.ctaPrimaryUrl',
        group: 'CTA',
        type: 'STRING',
        defaultValue: '#contact',
        control: 'text',
        inputType: 'url',
    },
    {
        key: 'marketing.bannerEnabled',
        group: 'Banner',
        type: 'BOOLEAN',
        defaultValue: 'false',
        control: 'toggle',
    },
    {
        key: 'marketing.bannerText',
        group: 'Banner',
        type: 'STRING',
        defaultValue: '',
        control: 'textarea',
    },
    {
        key: 'marketing.bannerSeverity',
        group: 'Banner',
        type: 'STRING',
        defaultValue: 'INFO',
        control: 'select',
        options: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
    },
    {
        key: 'marketing.contactEmail',
        group: 'Contact',
        type: 'STRING',
        defaultValue: 'hello@codegetit.com',
        control: 'text',
        inputType: 'email',
    },
    {
        key: 'marketing.staticStartingPrice',
        group: 'Pricing',
        type: 'INTEGER',
        defaultValue: 2500,
        control: 'number',
    },
    {
        key: 'marketing.webStartingPrice',
        group: 'Pricing',
        type: 'INTEGER',
        defaultValue: 5000,
        control: 'number',
    },
    {
        key: 'marketing.fullStartingPrice',
        group: 'Pricing',
        type: 'INTEGER',
        defaultValue: 13000,
        control: 'number',
    },
];

export const GROUP_META: Record<SettingGroup, { icon: LucideIcon; accent: string }> = {
    Availability: { icon: Globe2, accent: 'bg-sky-50 text-sky-700' },
    Pricing: { icon: DollarSign, accent: 'bg-emerald-50 text-emerald-700' },
    'Marketing Hero': { icon: Sparkles, accent: 'bg-violet-50 text-violet-700' },
    CTA: { icon: ArrowRight, accent: 'bg-amber-50 text-amber-700' },
    Banner: { icon: Megaphone, accent: 'bg-rose-50 text-rose-700' },
    Contact: { icon: Mail, accent: 'bg-cyan-50 text-cyan-700' },
};
