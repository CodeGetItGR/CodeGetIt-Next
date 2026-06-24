'use client'

import { useCallback, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { dataRightsApi, normalizeApiError } from '@/api';

type Mode = 'export' | 'erase';
type Status = 'idle' | 'submitting' | 'success' | 'error';

const GENERIC_CONFIRMATION =
    "If we have any data associated with that email, you'll receive a confirmation link within a few minutes. Check your inbox (and spam folder).";

const COPY: Record<
    Mode,
    {
        title: string;
        description: string;
        warning?: string;
        buttonLabel: string;
        sendingLabel: string;
        buttonClassName: string;
    }
> = {
    export: {
        title: 'Export your data',
        description: "Get a copy of the personal data we hold about you — your contact messages, project requests, and any offers addressed to you.",
        buttonLabel: 'Request export',
        sendingLabel: 'Sending...',
        buttonClassName: 'bg-brand-600 hover:bg-brand-700',
    },
    erase: {
        title: 'Delete your data',
        description: 'Ask us to delete the personal data we hold about you.',
        warning: 'This will permanently delete eligible data tied to that email. This cannot be undone.',
        buttonLabel: 'Request deletion',
        sendingLabel: 'Sending...',
        buttonClassName: 'bg-rose-600 hover:bg-rose-700',
    },
};

function DataRequestForm({ mode }: { mode: Mode }) {
    const copy = COPY[mode];
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [errorText, setErrorText] = useState('');
    const [fieldError, setFieldError] = useState('');

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setStatus('submitting');
            setErrorText('');
            setFieldError('');

            try {
                const submit = mode === 'export' ? dataRightsApi.requestExport : dataRightsApi.requestErasure;
                await submit({ email: email.trim() });
                setStatus('success');
            } catch (error) {
                const apiError = normalizeApiError(error);

                if (apiError.errorCode === 'RATE_LIMITED') {
                    setErrorText('Too many requests. Please wait a while before trying again.');
                } else if (apiError.fieldErrors?.email) {
                    setFieldError(apiError.fieldErrors.email);
                } else {
                    setErrorText(apiError.detail);
                }

                setStatus('error');
            }
        },
        [email, mode]
    );

    const isSubmitting = status === 'submitting';

    return (
        <section className="rounded-2xl border border-slate-900/[0.08] bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">{copy.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{copy.description}</p>

            {copy.warning && <p className="mt-3 text-sm font-medium text-rose-600">{copy.warning}</p>}

            {status === 'success' ? (
                <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {GENERIC_CONFIRMATION}
                </p>
            ) : (
                <form className="mt-5" onSubmit={handleSubmit}>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={`${mode}-email`}>
                        Email address
                    </label>
                    <input
                        id={`${mode}-email`}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
                    />
                    {fieldError && <p className="mt-1.5 text-xs text-rose-600">{fieldError}</p>}

                    {status === 'error' && errorText && <p className="mt-2 text-sm text-rose-600">{errorText}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mt-4 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${copy.buttonClassName}`}
                    >
                        {isSubmitting ? copy.sendingLabel : copy.buttonLabel}
                    </button>
                </form>
            )}
        </section>
    );
}

export default function ManageYourDataPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] px-6 py-20 text-slate-900">
            <div className="mx-auto max-w-2xl">
                <Link href="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                    ← Back to CodeGetIt
                </Link>

                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900">Manage Your Data</h1>
                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                    Under data protection law, you can ask for a copy of the personal data we hold about you, or ask us to delete it. Enter your
                    email below and we&apos;ll send a confirmation link — nothing happens until you click it. See our{' '}
                    <Link href="/privacy" className="font-medium text-slate-900 underline">
                        Privacy Policy
                    </Link>{' '}
                    for details on what we collect and how long we keep it.
                </p>

                <div className="mt-10 space-y-6">
                    <DataRequestForm mode="export" />
                    <DataRequestForm mode="erase" />
                </div>
            </div>
        </main>
    );
}
