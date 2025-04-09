import { get, post, put } from './apiClient';
import { Product, ProductFilterConfig, ProductsResponse } from '../types/product.types';

export const fetchProducts = async (filter: ProductFilterConfig): Promise<ProductsResponse> => {
    const { page, pageSize, categoryId, sort } = filter;

    const params: Record<string, string | number | undefined> = {
        _page: page,
        _limit: pageSize,
    };

    if (categoryId !== undefined) {
        params.category_id = categoryId;
    }

    if (sort && sort.field) {
        params._sort = sort.field;
        params._order = sort.direction;
    }

    // Fetch products with pagination
    const products = await get<Product[]>('/products', { params });

    const countParams: Record<string, number | undefined> = {};
    if (categoryId !== undefined) {
        countParams.category_id = categoryId;
    }

    const allProducts = await get<Product[]>('/products', { params: countParams });
    const total = allProducts.length;

    return {
        products,
        total,
    };
};

export const fetchProductById = async (id: number): Promise<Product> => {
    return get<Product>(`/products/${id}`);
};

export const updateProduct = async (
    id: number,
    productData: Partial<Product>
): Promise<Product> => {
    const updatedProduct = {
        ...productData,
        last_modified: new Date().toISOString(),
    };

    return put<Product, Partial<Product> & { last_modified: string }>(`/products/${id}`, updatedProduct);
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = {
        ...productData,
        last_modified: new Date().toISOString(),
    };

    return post<Product, Omit<Product, 'id'> & { last_modified: string }>('/products', newProduct);
};