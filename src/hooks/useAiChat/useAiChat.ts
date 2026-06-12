import { useContext } from 'react';
import { AiChatContext } from '../../providers/AiChatProvider/AiChatContext';

export const useAiChat = () => {
    const ctx = useContext(AiChatContext);
    if (!ctx) throw new Error('useAiChat must be used within AiChatProvider');
    return ctx;
};
