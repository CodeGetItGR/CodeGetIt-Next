import { memo, type ReactNode } from 'react';
import { Clock3, FileText, Lightbulb, ShieldAlert } from 'lucide-react';
import type { RequestAnalysisText } from '@/hooks';
import type { RequestAnalysisDataResponse } from '../../../api/types';

interface AnalysisSectionProps {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
    accentClassName?: string;
}

const AnalysisSection = memo(({ title, description, icon, children, accentClassName = 'border-slate-200 bg-white' }: AnalysisSectionProps) => (
    <article className={`rounded-2xl border p-5 shadow-sm ${accentClassName}`}>
        <div className="flex items-start gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">{icon}</div>
            <div>
                <h4 className="text-base font-semibold text-slate-900">{title}</h4>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
        </div>
        <div className="mt-4">{children}</div>
    </article>
));

AnalysisSection.displayName = 'AnalysisSection';

const renderList = (items: string[] | undefined, fallback: string) => {
    const cleaned = (items ?? []).map((item) => item.trim()).filter(Boolean);

    if (cleaned.length === 0) {
        return <p className="text-sm text-slate-500">{fallback}</p>;
    }

    return (
        <ul className="space-y-2 text-sm text-slate-700">
            {cleaned.map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-slate-400" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

interface RequestAnalysisSectionsProps {
    text: RequestAnalysisText;
    analysisData: RequestAnalysisDataResponse;
}

export const RequestAnalysisSections = memo(({ text, analysisData }: RequestAnalysisSectionsProps) => {
    return (
        <div className="grid gap-4 xl:grid-cols-2">
            <AnalysisSection title={text.risksAndBlockers} description={text.description} icon={<ShieldAlert className="h-4 w-4" />}>
                {renderList(analysisData.risks, text.noRisks)}
            </AnalysisSection>

            <AnalysisSection title={text.timelineSignals} description={text.description} icon={<Clock3 className="h-4 w-4" />}>
                {renderList(analysisData.timeline, text.noTimeline)}
            </AnalysisSection>

            <AnalysisSection title={text.requirements} description={text.description} icon={<FileText className="h-4 w-4" />}>
                {renderList(analysisData.requirements, text.noRequirements)}
            </AnalysisSection>

            <AnalysisSection
                title={text.recommendations}
                description={text.description}
                icon={<Lightbulb className="h-4 w-4" />}
                accentClassName="border-amber-200 bg-amber-50/40"
            >
                {renderList(analysisData.recommendations, text.noRecommendations)}
            </AnalysisSection>
        </div>
    );
});

RequestAnalysisSections.displayName = 'RequestAnalysisSections';
