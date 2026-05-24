import { memo, type ReactNode } from 'react';
import { Coins, Target, ShieldAlert, TimerReset } from 'lucide-react'
import {RequestAnalysisText} from "@/hooks";
import {RequestAnalysisDataResponse, RequestAnalysisResponse} from "@/api";

interface InfoCardProps {
    title: string;
    value: string;
    icon: ReactNode;
}

const InfoCard = memo(({ title, value, icon }: InfoCardProps) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2 text-slate-900">{icon}</div>
            <div>
                <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">{title}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
            </div>
        </div>
    </div>
));

InfoCard.displayName = 'InfoCard';

interface RequestAnalysisOverviewProps {
    text: RequestAnalysisText;
    analysis: RequestAnalysisResponse;
    analysisData: RequestAnalysisDataResponse;
    complexityLabel: string;
}

export const RequestAnalysisOverview = memo(({ text, analysis, analysisData, complexityLabel }: RequestAnalysisOverviewProps) => {
    const numberFormatter = new Intl.NumberFormat(undefined);
    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <InfoCard title={text.tokensUsed} value={numberFormatter.format(analysis.tokens_used)} icon={<Coins className="h-4 w-4" />} />
            <InfoCard title={text.estimatedCost} value={currencyFormatter.format(analysis.estimated_cost)} icon={<Target className="h-4 w-4" />} />
            <InfoCard
                title={text.estimatedEffort}
                value={`${numberFormatter.format(analysisData.estimatedEffortHours)} ${text.hoursLabel}`}
                icon={<TimerReset className="h-4 w-4" />}
            />
            <InfoCard title={text.complexity} value={complexityLabel} icon={<ShieldAlert className="h-4 w-4" />} />
        </div>
    );
});

RequestAnalysisOverview.displayName = 'RequestAnalysisOverview';
