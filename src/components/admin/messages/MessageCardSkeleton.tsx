export const MessageCardSkeleton = () => {
    return (
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-3 w-44 rounded bg-gray-100" />
                </div>
                <div className="h-6 w-20 rounded-full bg-gray-100" />
            </div>

            <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="h-3 w-16 rounded bg-gray-100" />
                <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
        </div>
    );
};
