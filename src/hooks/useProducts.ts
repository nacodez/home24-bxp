import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFilterConfig, ProductsResponse } from '../types/product.types';
import { fetchProducts, fetchProductById, updateProduct } from '../api/productApi';
import { useLastModifiedProduct } from './useLastModifiedProduct';

export const useProducts = (initialFilter?: Partial<ProductFilterConfig>) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setLastModifiedProduct } = useLastModifiedProduct();

    const [filter, setFilter] = useState<ProductFilterConfig>({
        page: 1,
        pageSize: 10,
        ...initialFilter
    });

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response: ProductsResponse = await fetchProducts(filter);
            setProducts(response.products);
            setTotal(response.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const updateProductAttributes = async (productId: number, updatedProduct: Partial<Product>) => {
        setIsLoading(true);
        setError(null);

        try {
            const updatedProductData = await updateProduct(productId, updatedProduct);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? updatedProductData : product
                )
            );

            setLastModifiedProduct(updatedProductData);

            return updatedProductData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getProductById = useCallback(async (id: number): Promise<Product> => {
        setIsLoading(true);
        setError(null);

        try {
            return await fetchProductById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        products,
        total,
        isLoading,
        error,
        filter,
        setFilter,
        updateProductAttributes,
        getProductById,
        refresh: loadProducts
    };
};