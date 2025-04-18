import { useContext } from 'react';
import RecentItemContext from '../context/RecentItemContext';

export const useRecentItem = () => {
    const ctx = useContext(RecentItemContext);

    if (!ctx) {
        throw new Error('useRecentItem must be used within a RecentItemProvider');
    }

    return ctx;
};