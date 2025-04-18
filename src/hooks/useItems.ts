import { useState, useEffect, useCallback } from 'react';
import { Item, FilterOpts, ItemsResponse } from '../types/item.types';
import { fetchItems, getItemById, updateItem } from '../api/productService';
import { useRecentItem } from './useRecentItem';

export const useItems = (initFilter?: Partial<FilterOpts>) => {
    const [items, setItems] = useState<Item[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const { setRecentItem } = useRecentItem();

    const [filter, setFilter] = useState<FilterOpts>({
        page: 1,
        pageSize: 10,
        ...initFilter
    });

    const loadItems = useCallback(async () => {
        setLoading(true);
        setErr(null);

        try {
            const resp: ItemsResponse = await fetchItems(filter);
            setItems(resp.products);
            setTotal(resp.total);
        } catch (error) {
            setErr(error instanceof Error ? error.message : 'Failed to fetch items');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const updateItemAttrs = async (itemId: number, updatedItem: Partial<Item>) => {
        setLoading(true);
        setErr(null);

        try {
            const updatedData = await updateItem(itemId, updatedItem);
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? updatedData : item
                )
            );

            setRecentItem(updatedData);

            return updatedData;
        } catch (error) {
            setErr(error instanceof Error ? error.message : 'Failed to update item');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchItemById = useCallback(async (id: number): Promise<Item> => {
        setLoading(true);
        setErr(null);

        try {
            const item = await getItemById(id);
            return item;
        } catch (error) {
            console.error(`Error fetching item by ID ${id}:`, error);
            setErr(error instanceof Error ? error.message : 'Failed to fetch item');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        items,
        total,
        loading,
        err,
        filter,
        setFilter,
        updateItemAttrs,
        getItemById: fetchItemById,
        refresh: loadItems
    };
};