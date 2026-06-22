'use client'

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { offerApi } from '@/api/offers';
import { queryKeys } from '@/api/queryKeys';
import { useLocale } from '@/i18n/UseLocale';
import { OfferDetailProvider, OfferDetailLayout } from './components';

type Params = {
    id: string;
};

type Props = {
    params: Params;
};

export default function OfferDetailPage({ params }: Props) {
    const { t } = useLocale();
    const text = t.admin.offers.detail;

    // @ts-expect-error - Next.js 13 app router params typing is weird
    const { id } = use<Params>(params);

    const offerQuery = useQuery({
        queryKey: queryKeys.offers.detail(id),
        queryFn: () => offerApi.getById(id),
        enabled: Boolean(id),
    });

    if (offerQuery.isLoading) {
        return <p className="text-sm text-gray-500">{text.loading}</p>;
    }

    if (!offerQuery.data) {
        return <p className="text-sm text-gray-500">{text.notFound}</p>;
    }

    return (
        <OfferDetailProvider id={id} offer={offerQuery.data} text={text}>
            <OfferDetailLayout />
        </OfferDetailProvider>
    );
}
