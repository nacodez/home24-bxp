import { useState, useEffect } from 'react';
import { Category } from '../types/category.types';
import { fetchCategories } from '../api/categoryApi';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch categories');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);
    const getCategoryTree = () => {
        const categoryMap = new Map<number, Category & { children: Category[] }>();

        categories.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] });
        });

        const rootCategories: (Category & { children: Category[] })[] = [];

        categoryMap.forEach(category => {
            if (category.parent_id && categoryMap.has(category.parent_id)) {
                categoryMap.get(category.parent_id)?.children.push(category);
            } else {
                rootCategories.push(category);
            }
        });

        return rootCategories;
    };

    return {
        categories,
        categoryTree: getCategoryTree(),
        isLoading,
        error
    };
};