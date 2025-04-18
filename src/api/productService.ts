import { getStuff, postStuff, updateStuff } from './httpService';
import { Item, FilterOpts, ItemsResponse } from '../types/item.types';

export const fetchItems = async (filter: FilterOpts): Promise<ItemsResponse> => {
    const { page, pageSize, categoryId, sort } = filter;

    const params: Record<string, string | number | undefined> = {};

    if (categoryId !== undefined) {
        params.category_id = categoryId;
    }

    try {
        const allItems = await getStuff<Item[]>('/products', { params });
        const totalCount = allItems.length;

        const sortedItems = [...allItems];
        if (sort && sort.field) {

            sortedItems.sort((a, b) => {
                const aVal = a[sort.field as keyof Item];
                const bVal = b[sort.field as keyof Item];


                if (sort.field === 'id') {
                    const aNum = typeof aVal === 'string' ? parseInt(aVal) : (aVal as number);
                    const bNum = typeof bVal === 'string' ? parseInt(bVal) : (bVal as number);
                    return sort.direction === 'asc' ? aNum - bNum : bNum - aNum;
                }

                if (aVal === undefined || aVal === null) {
                    return sort.direction === 'asc' ? 1 : -1;
                }
                if (bVal === undefined || bVal === null) {
                    return sort.direction === 'asc' ? -1 : 1;
                }

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sort.direction === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                } else {
                    const aCompVal = typeof aVal === 'object' ? JSON.stringify(aVal) : aVal;
                    const bCompVal = typeof bVal === 'object' ? JSON.stringify(bVal) : bVal;

                    if (aCompVal < bCompVal) {
                        return sort.direction === 'asc' ? -1 : 1;
                    }
                    if (aCompVal > bCompVal) {
                        return sort.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        const startIdx = (page - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const pageItems = sortedItems.slice(startIdx, endIdx)

        return {
            products: pageItems,
            total: totalCount,
        };
    } catch (err) {
        console.error("Error fetching items:", err);
        throw err;
    }
};

export const getItemById = async (id: number): Promise<Item> => {
    try {
        try {
            const item = await getStuff<Item>(`/products/${id}`);
            return item;
        } catch (directErr) {
            console.error("Fetching direct failed, revert back to filtering all products", directErr);

            const allItems = await getStuff<Item[]>('/products');
            const item = allItems.find(p => p.id === id);

            if (!item) {
                throw new Error(`Item with ID ${id} not found`);
            }

            return item;
        }
    } catch (err) {
        console.error(`Failed to load item with ID ${id}:`, err);
        throw new Error(`Failed to load item with ID ${id}. ${err instanceof Error ? err.message : ''}`);
    }
};

export const updateItem = async (
    id: number,
    itemData: Partial<Item>
): Promise<Item> => {
    try {
        const updatedItem = {
            ...itemData,
            last_modified: new Date().toISOString(),
        };

        const result = await updateStuff<Item, Partial<Item> & { last_modified: string }>(
            `/products/${id}`,
            updatedItem
        );

        return result;
    } catch (err) {
        console.error(`Error updating item with ID ${id}:`, err);
        throw new Error(`Failed to update item. ${err instanceof Error ? err.message : ''}`);
    }
};

export const createItem = async (itemData: Omit<Item, 'id'>): Promise<Item> => {
    try {
        const newItem = {
            ...itemData,
            last_modified: new Date().toISOString(),
        };

        const result = await postStuff<Item, Omit<Item, 'id'> & { last_modified: string }>(
            '/products',
            newItem
        );

        return result;
    } catch (err) {
        console.error(`Error creating item:`, err);
        throw new Error(`Failed to create item. ${err instanceof Error ? err.message : ''}`);
    }
};