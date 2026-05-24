import { useContext } from 'react';
import { PublicSettingsContext } from '@/settings/public-settings-context';

export const usePublicSettings = () => {
    const context = useContext(PublicSettingsContext);

    if (!context) {
        throw new Error('usePublicSettings must be used within PublicSettingsProvider');
    }

    return context;
};
