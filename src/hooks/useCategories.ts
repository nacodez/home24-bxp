import { useState, useEffect } from 'react';
import { Category } from '../types/category.types';
import { fetchCategories } from '../api/categoryFetcher';

interface CatWithChildren extends Category {
    children: CatWithChildren[];
}

export const useCategories = () => {
    const [cats, setCats] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        const getCats = async () => {
            setLoading(true);
            setErr(null);

            try {
                const data = await fetchCategories();
                setCats(data);
            } catch (error) {
                setErr(error instanceof Error ? error.message : 'Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        getCats();
    }, []);

    const buildCatTree = (): CatWithChildren[] => {

        const catMap = new Map<number, CatWithChildren>();

        cats.forEach(cat => {
            const id = typeof cat.id === 'string' ? parseInt(cat.id) : cat.id;
            catMap.set(id, { ...cat, children: [] } as CatWithChildren);
        });

        const rootCats: CatWithChildren[] = [];

        cats.forEach(cat => {
            const id = typeof cat.id === 'string' ? parseInt(cat.id) : cat.id;
            const catWithChildren = catMap.get(id);

            if (!catWithChildren) return;

            if (cat.parent_id) {
                const parentId = typeof cat.parent_id === 'string' ?
                    parseInt(cat.parent_id) : cat.parent_id;

                const parent = catMap.get(parentId);

                if (parent) {

                    parent.children.push(catWithChildren);
                } else {
                    rootCats.push(catWithChildren);
                }
            } else {

                rootCats.push(catWithChildren);
            }
        });
        return rootCats;
    };

    return {
        cats,
        catTree: buildCatTree(),
        loading,
        err
    };
};