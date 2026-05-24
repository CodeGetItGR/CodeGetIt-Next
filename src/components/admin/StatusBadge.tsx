import type { GithubRepoStatus, OfferStatus, Priority, ProjectStatus, RequestStatus } from '@/api';

type StatusValue = RequestStatus | OfferStatus | ProjectStatus | Priority | GithubRepoStatus;

const colorMap: Record<StatusValue, string> = {
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
    COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    SENT: 'bg-blue-100 text-blue-800 border-blue-300',
    ACCEPTED_BY_CLIENT: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    REJECTED_BY_CLIENT: 'bg-orange-50 text-orange-700 border-orange-200',
    CANCELLED: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    PLANNING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    IN_PROGRESS: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    ON_HOLD: 'bg-amber-50 text-amber-700 border-amber-200',
    NOT_CREATED: 'bg-slate-100 text-slate-700 border-slate-200',
    CREATED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
    URGENT: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface StatusBadgeProps {
    value: StatusValue;
}

export const StatusBadge = ({ value }: StatusBadgeProps) => {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${colorMap[value] ?? 'border-gray-200 bg-gray-100 text-gray-700'}`}
        >
            {value.replace(/_/g, ' ')}
        </span>
    );
};
