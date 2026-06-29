import { Inbox } from 'lucide-react';

export const MessagesEmptyState = () => {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Inbox className="h-8 w-8 text-gray-400" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">No contact messages yet</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                No contact messages have been submitted yet. When visitors contact you, they&apos;ll appear here.
            </p>
        </div>
    );
};
