'use client'

import { useCallback, useDeferredValue, useMemo, useState, type ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ListFilter, RotateCcw, Save } from 'lucide-react';
import { queryKeys, settingsApi } from '@/api';
import {  } from '../../../api/settings';
import { useLocale } from '@/i18n/UseLocale';
import { cn } from '@/lib/utils';
import {
    BASE_DEFINITIONS,
    DEFAULT_BANNER_SEVERITIES,
    fieldMatchesQuery,
    formatFieldValue,
    GROUP_META,
    GROUP_ORDER,
    INPUT_CLASS,
    optionGroupMatchesQuery,
    PANEL_CLASS,
    type SettingDefinition,
} from '@/components';
import { SettingsField, Switch, SettingsPageHeader, SectionCard} from '@/components';
export default function SettingsPage(){
    const { t } = useLocale();
    const copy = t.admin.settings;
    const queryClient = useQueryClient();
    const [draftValues, setDraftValues] = useState<Record<string, string>>({});
    const [mode, setMode] = useState<'draft' | 'published'>('draft');
    const [searchValue, setSearchValue] = useState('');
    const deferredSearchValue = useDeferredValue(searchValue.trim().toLowerCase());

    const settingsQuery = useQuery({
        queryKey: queryKeys.settings.list,
        queryFn: () => settingsApi.listAll(),
    });

    const optionsQuery = useQuery({
        queryKey: queryKeys.settings.options,
        queryFn: () => settingsApi.listOptions(),
    });

    const serverValues = useMemo(() => {
        const merged = BASE_DEFINITIONS.reduce<Record<string, string>>((acc, definition) => {
            acc[definition.key] = `${definition.defaultValue}`;
            return acc;
        }, {});

        for (const item of settingsQuery.data ?? []) {
            merged[item.key] = item.value;
        }

        return merged;
    }, [settingsQuery.data]);

    const localizedDefinitions = useMemo<SettingDefinition[]>(() => {
        const labels = copy.fields;
        const labelMap: Record<string, string> = {
            'availability.acceptingProjects': labels.availability.acceptingProjects,
            'availability.statusMessage': labels.availability.statusMessage,
            'availability.contactFormEnabled': labels.availability.contactFormEnabled,
            'availability.requestSubmissionEnabled': labels.availability.requestSubmissionEnabled,
            'marketing.heroTitle': labels.marketingHero.heroTitle,
            'marketing.heroSubtitle': labels.marketingHero.heroSubtitle,
            'marketing.ctaPrimaryText': labels.cta.primaryText,
            'marketing.ctaPrimaryUrl': labels.cta.primaryUrl,
            'marketing.bannerEnabled': labels.banner.bannerEnabled,
            'marketing.bannerText': labels.banner.bannerText,
            'marketing.bannerSeverity': labels.banner.bannerSeverity,
            'marketing.contactEmail': labels.contact.publicContactEmail,
            'marketing.staticStartingPrice': labels.pricing.staticStartingPrice,
            'marketing.webStartingPrice': labels.pricing.webStartingPrice,
            'marketing.fullStartingPrice': labels.pricing.fullStartingPrice,
        };

        return BASE_DEFINITIONS.map((definition) => ({
            ...definition,
            label: labelMap[definition.key] ?? definition.key,
        }));
    }, [copy.fields]);

    const draftMergedValues = useMemo(() => ({ ...serverValues, ...draftValues }), [serverValues, draftValues]);
    const displayValues = mode === 'published' ? serverValues : draftMergedValues;
    const dirtyCount = Object.keys(draftValues).length;
    const isDirty = dirtyCount > 0;

    const groupedDefinitions = useMemo(
        () =>
            GROUP_ORDER.map((group) => ({
                group,
                items: localizedDefinitions.filter((definition) => definition.group === group && fieldMatchesQuery(definition, deferredSearchValue)),
            })).filter((group) => group.items.length > 0),
        [deferredSearchValue, localizedDefinitions]
    );

    const pricingDefinitions = useMemo(
        () => localizedDefinitions.filter((definition) => definition.group === 'Pricing' && fieldMatchesQuery(definition, deferredSearchValue)),
        [deferredSearchValue, localizedDefinitions]
    );

    const configurableOptionGroups = useMemo(
        () => (optionsQuery.data?.groups ?? []).filter((group) => group.configurable && optionGroupMatchesQuery(group, deferredSearchValue)),
        [deferredSearchValue, optionsQuery.data?.groups]
    );

    const bannerSeverityOptions = useMemo(() => {
        const group = optionsQuery.data?.groups.find((item) => item.key === 'settings.marketing.bannerSeverity');
        return group?.items.length ? group.items.map((item) => item.value) : DEFAULT_BANNER_SEVERITIES;
    }, [optionsQuery.data?.groups]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const items = localizedDefinitions
                .filter((definition) => draftValues[definition.key] !== undefined)
                .map((definition) => ({
                    key: definition.key,
                    type: definition.type,
                    value: `${draftValues[definition.key]}`,
                }));

            await settingsApi.batchUpdate({ items });
            return items.map((item) => item.key);
        },
        onSuccess: async (savedKeys) => {
            setDraftValues((current) => {
                const next = { ...current };
                for (const key of savedKeys) {
                    delete next[key];
                }
                return next;
            });

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.settings.list }),
                queryClient.invalidateQueries({ queryKey: queryKeys.settings.public }),
            ]);
        },
    });

    const updateDisabledOptionsMutation = useMutation({
        mutationFn: ({ groupKey, disabledValues }: { groupKey: string; disabledValues: string[] }) =>
            settingsApi.updateDisabledOptions(groupKey, { disabledValues }),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.settings.options }),
                queryClient.invalidateQueries({ queryKey: queryKeys.settings.optionsPublic }),
            ]);
        },
    });

    const updateValue = useCallback(
        (key: string, value: string) => {
            setDraftValues((prev) => {
                const next = { ...prev };
                if (serverValues[key] === value) {
                    delete next[key];
                } else {
                    next[key] = value;
                }
                return next;
            });
        },
        [serverValues]
    );

    const resetValue = useCallback(
        (key: string) => {
            const definition = localizedDefinitions.find((item) => item.key === key);
            if (!definition) {
                return;
            }
            updateValue(key, `${definition.defaultValue}`);
        },
        [localizedDefinitions, updateValue]
    );

    const handleSave = useCallback(() => {
        saveMutation.mutate();
    }, [saveMutation]);

    const handleDiscardDraft = useCallback(() => {
        setDraftValues({});
    }, []);

    const handleOptionToggle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const groupKey = event.currentTarget.dataset.groupKey;
            const optionValue = event.currentTarget.dataset.optionValue;
            if (!groupKey || !optionValue) {
                return;
            }

            const group = configurableOptionGroups.find((item) => item.key === groupKey);
            if (!group) {
                return;
            }

            const currentlyDisabled = new Set(group.items.filter((item) => !item.enabled).map((item) => item.value));
            if (event.currentTarget.checked) {
                currentlyDisabled.delete(optionValue);
            } else {
                currentlyDisabled.add(optionValue);
            }

            updateDisabledOptionsMutation.mutate({
                groupKey,
                disabledValues: Array.from(currentlyDisabled),
            });
        },
        [configurableOptionGroups, updateDisabledOptionsMutation]
    );

    const loading = settingsQuery.isLoading;
    const hasError = settingsQuery.isError;
    const searchHasResults = groupedDefinitions.length > 0 || configurableOptionGroups.length > 0;

    return (
        <div className="space-y-6 pb-28">
            <SettingsPageHeader
                dirtyCount={dirtyCount}
                mode={mode}
                onModeChange={setMode}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                copy={copy.page}
            />

            {loading && (
                <div className={PANEL_CLASS}>
                    <div className="p-8 text-sm text-gray-500">{copy.page.loading}</div>
                </div>
            )}

            {hasError && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{copy.page.loadError}</div>}

            {!loading && !hasError && !searchHasResults && deferredSearchValue && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
                    {copy.page.noMatches} “{searchValue.trim()}”.
                </div>
            )}

            {!loading && !hasError && searchHasResults && (
                <div className="space-y-6">
                    {groupedDefinitions.map(({ group, items }) => {
                        const meta = GROUP_META[group];
                        const sectionCopy =
                            group === 'Availability'
                                ? copy.sections.availability
                                : group === 'Pricing'
                                  ? copy.sections.pricing
                                  : group === 'Marketing Hero'
                                    ? copy.sections.marketingHero
                                    : group === 'CTA'
                                      ? copy.sections.cta
                                      : group === 'Banner'
                                        ? copy.sections.banner
                                        : copy.sections.contact;

                        return (
                            <SectionCard
                                key={group}
                                title={sectionCopy.title}
                                description={sectionCopy.description}
                                icon={meta.icon}
                                count={items.length}
                                sectionLabel={copy.states.sectionLabel}
                                fieldLabel={copy.states.fieldsLabel}
                                accentClassName={meta.accent}
                            >
                                {group === 'Pricing' ? (
                                    <div className="overflow-hidden rounded-2xl border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
                                                        {copy.tables.plan}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
                                                        {copy.tables.default}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
                                                        {copy.tables.current}
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
                                                        {copy.tables.action}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {pricingDefinitions.map((definition) => {
                                                    const value = displayValues[definition.key] ?? `${definition.defaultValue}`;
                                                    const dirty = draftValues[definition.key] !== undefined;

                                                    return (
                                                        <tr key={definition.key} className={cn('transition', dirty && 'bg-amber-50/40')}>
                                                            <td className="px-4 py-4">
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">{definition.label}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                                {formatFieldValue(definition, definition.defaultValue, copy)}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <input
                                                                    type="number"
                                                                    inputMode="numeric"
                                                                    step={1}
                                                                    value={value}
                                                                    disabled={mode === 'published'}
                                                                    onChange={(event) => updateValue(definition.key, event.currentTarget.value)}
                                                                    className={cn(
                                                                        INPUT_CLASS,
                                                                        'max-w-40',
                                                                        dirty && 'border-amber-300 bg-amber-50/40'
                                                                    )}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-4 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => resetValue(definition.key)}
                                                                    disabled={mode === 'published' || !dirty}
                                                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                                    {copy.states.resetToDefault}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {items.map((definition) => {
                                            const value = displayValues[definition.key] ?? `${definition.defaultValue}`;
                                            const dirty = draftValues[definition.key] !== undefined;

                                            return (
                                                <SettingsField
                                                    key={definition.key}
                                                    definition={definition}
                                                    value={value}
                                                    defaultValue={`${definition.defaultValue}`}
                                                    dirty={dirty}
                                                    disabled={mode === 'published'}
                                                    onChange={updateValue}
                                                    onReset={resetValue}
                                                    copy={copy}
                                                    selectOptions={definition.key === 'marketing.bannerSeverity' ? bannerSeverityOptions : undefined}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </SectionCard>
                        );
                    })}

                    {saveMutation.isError && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{copy.page.saveError}</div>
                    )}
                    {saveMutation.isSuccess && !isDirty && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {copy.page.publishSuccess}
                        </div>
                    )}

                    <SectionCard
                        title={copy.sections.requestOptions.title}
                        description={copy.sections.requestOptions.description}
                        icon={ListFilter}
                        count={configurableOptionGroups.length}
                        sectionLabel={copy.states.sectionLabel}
                        fieldLabel={copy.states.fieldsLabel}
                        accentClassName="bg-gray-50 text-gray-700"
                    >
                        {optionsQuery.isLoading && <p className="text-sm text-gray-500">{copy.sections.requestOptions.loading}</p>}

                        {optionsQuery.isError && (
                            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {copy.sections.requestOptions.failed}
                            </p>
                        )}

                        {!optionsQuery.isLoading && !optionsQuery.isError && configurableOptionGroups.length === 0 && (
                            <p className="text-sm text-gray-500">
                                {deferredSearchValue ? copy.sections.requestOptions.noMatch : copy.sections.requestOptions.noGroups}
                            </p>
                        )}

                        <div className="space-y-4">
                            {configurableOptionGroups.map((group) => (
                                <article key={group.key} className="rounded-2xl border border-gray-200 bg-gray-50/40 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {group.items.filter((item) => item.enabled).length} {copy.states.enabled} of {group.items.length}
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600">
                                            {copy.states.groupKeyLabel}: {group.key}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                        {group.items.map((item) => (
                                            <label
                                                key={item.value}
                                                className={cn(
                                                    'flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 transition',
                                                    item.enabled ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                                                )}
                                            >
                                                <div>
                                                    <p className={cn('text-sm font-medium', item.enabled ? 'text-gray-900' : 'text-gray-500')}>
                                                        {item.label}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">{item.value}</p>
                                                </div>

                                                <Switch
                                                    checked={item.enabled}
                                                    disabled={updateDisabledOptionsMutation.isPending || mode === 'published'}
                                                    onChange={handleOptionToggle}
                                                    inputProps={{
                                                        'data-group-key': group.key,
                                                        'data-option-value': item.value,
                                                    }}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </article>
                            ))}

                            {updateDisabledOptionsMutation.isError && (
                                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {copy.sections.requestOptions.failed}
                                </p>
                            )}
                        </div>
                    </SectionCard>
                </div>
            )}

            {(isDirty || saveMutation.isPending || mode === 'published') && !loading && !hasError && (
                <div className="sticky bottom-4 z-30">
                    <div className="mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-white/95 px-4 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl bg-slate-900 p-2 text-white">
                                    <Save className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {mode === 'published' ? copy.page.publishedPreview : `${dirtyCount} ${copy.page.unsavedChanges}`}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {mode === 'published' ? copy.page.switchBackHint : copy.page.draftHint}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {mode === 'published' ? (
                                    <button
                                        type="button"
                                        onClick={() => setMode('draft')}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                    >
                                        {copy.page.backToDraft}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleDiscardDraft}
                                            disabled={!isDirty || saveMutation.isPending}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {copy.page.discardDraft}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={!isDirty || saveMutation.isPending || settingsQuery.isError}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {saveMutation.isPending ? (
                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    {copy.page.publishing}
                                                </>
                                            ) : (
                                                <>
                                                    {copy.page.publishChanges}
                                                    <ArrowRight className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
