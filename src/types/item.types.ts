export type AttributeType = 'number' | 'text' | 'url' | 'tags' | 'boolean';

export interface AttributeValue {
    code: string;
    value: string | number | boolean | string[] | null;
    type: AttributeType;
    label?: string;
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    attributes: AttributeValue[];
    last_modified?: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
}

export interface ProductSortConfig {
    field: keyof Product | '';
    direction: 'asc' | 'desc';
}

export interface ProductFilterConfig {
    categoryId?: number;
    page: number;
    pageSize: number;
    sort?: ProductSortConfig;
}
