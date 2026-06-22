import { useOfferDetail } from './useOfferDetail';

export const SubmissionHistory = () => {
    const { text, submissions } = useOfferDetail();

    if (!submissions || submissions.length === 0) {
        return null;
    }

    return (
        <section id="offer-history" className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{text.history.title}</h3>
            <div className="space-y-3">
                {submissions.map((submission) => (
                    <div key={submission.id} className="flex gap-4 border-b border-gray-200 py-3 last:border-b-0">
                        <div className="shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                <span className="text-xs font-semibold text-gray-700">{submission.revisionNumber}</span>
                            </div>
                        </div>
                        <div className="grow">
                            <p className="text-sm font-medium text-gray-900">{submission.action}</p>
                            {submission.note && <p className="mt-1 text-sm text-gray-600">{submission.note}</p>}
                            <p className="mt-1 text-xs text-gray-500">
                                {new Date(submission.createdAt || '').toLocaleDateString()} {text.history.at}{' '}
                                {new Date(submission.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
