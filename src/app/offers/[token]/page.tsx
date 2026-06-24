'use client'

import { useMemo, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicOfferApi } from '@/api';
import { useLocale } from '@/i18n/UseLocale';
import { en, el } from '@/i18n/locales';
import { PublicOfferProvider, PublicOfferLayout } from './components';

type Params = {
    token: string;
};

type Props = {
    params: Params;
};

export default function PublicOfferPage({ params }: Props) {
    // The site locale toggle only drives the loading/not-found states, before
    // we know which language the offer itself was written in. Once the offer
    // loads, its own `language` field is the source of truth for everything else.
    const { t } = useLocale();

    // @ts-expect-error - Next.js 13 app router params typing is weird
    const { token } = use<Params>(params);
    const fallbackText = useMemo(() => t.publicOffer, [t]);

    const offerQuery = useQuery({
        queryKey: ['public-offer', token],
        queryFn: () => publicOfferApi.getByToken(token),
        enabled: Boolean(token),
    });

    if (offerQuery.isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
                <p className="text-slate-500">{fallbackText.loadingOffer}</p>
            </div>
        );
    }

    if (offerQuery.isError || !offerQuery.data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-slate-900">{fallbackText.offerNotFoundTitle}</h2>
                    <p className="text-slate-500">{fallbackText.offerNotFoundBody}</p>
                </div>
            </div>
        );
    }

    const offer = offerQuery.data;
    const isGreek = offer.offer.language === 'EL';
    const text = isGreek ? el.publicOffer : en.publicOffer;
    const localeTag = isGreek ? 'el-GR' : 'en-US';

    return (
        <PublicOfferProvider token={token} offer={offer} text={text} localeTag={localeTag} onRefetch={offerQuery.refetch}>
            <PublicOfferLayout />
        </PublicOfferProvider>
    );
}
