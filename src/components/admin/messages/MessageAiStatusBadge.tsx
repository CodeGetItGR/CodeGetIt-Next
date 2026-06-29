import type { AiAcknowledgmentResponse } from '@/api';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface MessageAiStatusBadgeProps {
    aiAcknowledgments: AiAcknowledgmentResponse[];
}

const labelByStatus: Record<AiAcknowledgmentResponse['status'], string> = {
    SUCCESS: 'AI sent',
    ERROR: 'AI failed',
    RATE_LIMITED: 'Rate limited',
    TIMEOUT: 'Timed out',
};

export const MessageAiStatusBadge = ({ aiAcknowledgments }: MessageAiStatusBadgeProps) => {
    if (aiAcknowledgments.length === 0) {
        return <StatusBadge value="DRAFT" label="Static fallback" />;
    }

    const latest = aiAcknowledgments[0];
    const retryCount = aiAcknowledgments.length - 1;
    const label =
        retryCount > 0
            ? `${labelByStatus[latest.status]} · ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}`
            : labelByStatus[latest.status];

    return <StatusBadge value={latest.status} label={label} />;
};
