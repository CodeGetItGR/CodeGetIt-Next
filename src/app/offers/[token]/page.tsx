'use client'

import { useMemo, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicOfferApi } from '@/api';
import { useLocale } from '@/i18n/UseLocale';
import { PublicOfferProvider, PublicOfferLayout } from './components';

type Params = {
    token: string;
};

type Props = {
    params: Params;
};

export default function PublicOfferPage({ params }: Props) {
    const { locale, t } = useLocale();

    // @ts-expect-error - Next.js 13 app router params typing is weird
    const { token } = use<Params>(params);
    const localeTag = useMemo(() => (locale === 'el' ? 'el-GR' : 'en-US'), [locale]);
    const text = useMemo(() => t.publicOffer, [t]);

    const offerQuery = useQuery({
        queryKey: ['public-offer', token],
        queryFn: () => publicOfferApi.getByToken(token),
        enabled: Boolean(token),
    });

    if (offerQuery.isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
                <p className="text-slate-500">{text.loadingOffer}</p>
            </div>
        );
    }

    if (offerQuery.isError || !offerQuery.data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-slate-900">{text.offerNotFoundTitle}</h2>
                    <p className="text-slate-500">{text.offerNotFoundBody}</p>
                </div>
            </div>
        );
    }

    return (
        <PublicOfferProvider token={token} offer={offerQuery.data} text={text} localeTag={localeTag} onRefetch={offerQuery.refetch}>
            <PublicOfferLayout />
        </PublicOfferProvider>
    );
}
