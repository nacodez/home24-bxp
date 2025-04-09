import { useContext } from 'react';
import { LastModifiedProductContext } from '../context/LastModifiedProductContext';

export const useLastModifiedProduct = () => {
    const context = useContext(LastModifiedProductContext);

    if (!context) {
        throw new Error('useLastModifiedProduct must be used within a LastModifiedProductProvider');
    }

    return context;
};