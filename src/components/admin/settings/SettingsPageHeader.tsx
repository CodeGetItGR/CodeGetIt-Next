import type { Translations } from '@/i18n/types.ts';
import { CircleAlert, CircleCheck, Eye, PencilLine, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

export const SettingsPageHeader = ({
    dirtyCount,
    mode,
    onModeChange,
    searchValue,
    onSearchChange,
    copy,
}: {
    dirtyCount: number;
    mode: 'draft' | 'published';
    onModeChange: (mode: 'draft' | 'published') => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    copy: Translations['admin']['settings']['page'];
}) => (
    <div className="rounded-[2rem] border border-gray-200 bg-linear-to-br from-white via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
                <p className="text-sm font-medium tracking-[0.16em] text-gray-500 uppercase">{copy.eyebrow}</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{copy.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{copy.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                        {copy.draftBuffer}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        {dirtyCount > 0 ? (
                            <CircleAlert className="h-3.5 w-3.5 text-amber-600" />
                        ) : (
                            <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        {dirtyCount > 0 ? `${dirtyCount} ${copy.unsavedChanges}` : copy.noUnsavedChanges}
                    </span>
                    {mode === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700">
                            <Eye className="h-3.5 w-3.5" />
                            {copy.publishedPreview}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                            <PencilLine className="h-3.5 w-3.5" />
                            {copy.draftEditing}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3">
                <label className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.currentTarget.value)}
                        placeholder={copy.searchPlaceholder}
                        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-gray-900 shadow-sm transition outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                    />
                </label>

                <div className="inline-flex self-start rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                        type="button"
                        onClick={() => onModeChange('draft')}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                            mode === 'draft' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                        )}
                    >
                        <PencilLine className="h-4 w-4" />
                        {copy.draft}
                    </button>
                    <button
                        type="button"
                        onClick={() => onModeChange('published')}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                            mode === 'published' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                        )}
                    >
                        <Eye className="h-4 w-4" />
                        {copy.published}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
