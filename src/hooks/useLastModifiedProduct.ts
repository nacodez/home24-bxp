import { useContext } from 'react';
import { LastModifiedProductContext } from '../context/RecentItemContext';

export const useLastModifiedProduct = () => {
    const context = useContext(LastModifiedProductContext);

    if (!context) {
        throw new Error('useLastModifiedProduct must be used within a LastModifiedProductProvider');
    }

    return context;
};