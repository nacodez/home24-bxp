import { get, post, put } from './apiClient';
import { Product, ProductFilterConfig, ProductsResponse } from '../types/product.types';

export const fetchProducts = async (filter: ProductFilterConfig): Promise<ProductsResponse> => {
    const { page, pageSize, categoryId, sort } = filter;

    const params: Record<string, string | number | undefined> = {};


    if (categoryId !== undefined) {
        params.category_id = categoryId;
    }

    try {

        const allProducts = await get<Product[]>('/products', { params });
        const total = allProducts.length;

        const sortedProducts = [...allProducts];
        if (sort && sort.field) {

            sortedProducts.sort((a, b) => {

                const aValue = a[sort.field as keyof Product];
                const bValue = b[sort.field as keyof Product];


                if (aValue === undefined || aValue === null) {
                    return sort.direction === 'asc' ? 1 : -1;
                }
                if (bValue === undefined || bValue === null) {
                    return sort.direction === 'asc' ? -1 : 1;
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sort.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                } else {
                    const aCompare = typeof aValue === 'object' ? JSON.stringify(aValue) : aValue;
                    const bCompare = typeof bValue === 'object' ? JSON.stringify(bValue) : bValue;

                    if (aCompare < bCompare) {
                        return sort.direction === 'asc' ? -1 : 1;
                    }
                    if (aCompare > bCompare) {
                        return sort.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

        return {
            products: paginatedProducts,
            total,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const fetchProductById = async (id: number): Promise<Product> => {
    try {
        const allProducts = await get<Product[]>('/products');

        const product = allProducts.find(p => p.id === id);

        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }

        return product;
    } catch (error) {
        throw new Error(`Failed to load product with ID ${id}. ${error instanceof Error ? error.message : ''}`);
    }
};

export const updateProduct = async (
    id: number,
    productData: Partial<Product>
): Promise<Product> => {
    try {

        const updatedProduct = {
            ...productData,
            last_modified: new Date().toISOString(),
        };

        const result = await put<Product, Partial<Product> & { last_modified: string }>(
            `/products/${id}`,
            updatedProduct
        );

        return result;
    } catch (error) {
        console.error(`Error updating product with ID ${id}:`, error);
        throw new Error(`Failed to update product. ${error instanceof Error ? error.message : ''}`);
    }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {

        const newProduct = {
            ...productData,
            last_modified: new Date().toISOString(),
        };

        const result = await post<Product, Omit<Product, 'id'> & { last_modified: string }>(
            '/products',
            newProduct
        );

        return result;
    } catch (error) {
        console.error(`Error creating product:`, error);
        throw new Error(`Failed to create product. ${error instanceof Error ? error.message : ''}`);
    }
};