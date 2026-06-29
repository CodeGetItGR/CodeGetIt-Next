import { AnimatePresence, motion } from 'framer-motion';
import { Mail, ChevronDown } from 'lucide-react';
import type { ContactMessageResponse } from '@/api';
import { cn } from '@/lib/utils';
import { AiAcknowledgmentTimeline } from './AiAcknowledgmentTimeline';
import { MessageAiStatusBadge } from './MessageAiStatusBadge';
import { MessageAvatar } from './MessageAvatar';

interface MessageCardProps {
    message: ContactMessageResponse;
    isExpanded: boolean;
    onToggle: () => void;
}

export const MessageCard = ({ message, isExpanded, onToggle }: MessageCardProps) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
        }
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'rounded-2xl border bg-white p-5 transition-shadow duration-200',
                isExpanded ? 'border-gray-300 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            )}
        >
            <div role="button" tabIndex={0} aria-expanded={isExpanded} onClick={onToggle} onKeyDown={handleKeyDown} className="cursor-pointer">
                <div className="flex items-center gap-3">
                    <MessageAvatar name={message.name} />
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900">{message.name}</p>
                        <a
                            href={`mailto:${message.email}`}
                            onClick={(event) => event.stopPropagation()}
                            className="block truncate text-sm text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline"
                        >
                            {message.email}
                        </a>
                    </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-600">{message.message}</p>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <MessageAiStatusBadge aiAcknowledgments={message.aiAcknowledgments} />
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <time className="tabular-nums">{new Date(message.createdAt).toLocaleDateString()}</time>
                        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </motion.span>
                    </div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="mt-5 grid gap-8 border-t border-gray-100 pt-5 md:grid-cols-2">
                            <div>
                                <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Message</h4>
                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{message.message}</p>
                                </div>
                                <a
                                    href={`mailto:${message.email}?subject=Re: your message`}
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    <Mail className="h-3.5 w-3.5" />
                                    Reply via Email
                                </a>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">AI Acknowledgment History</h4>
                                <div className="mt-2">
                                    <AiAcknowledgmentTimeline aiAcknowledgments={message.aiAcknowledgments} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
