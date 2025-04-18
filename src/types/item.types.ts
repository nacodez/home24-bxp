export type AttrType = 'number' | 'text' | 'url' | 'tags' | 'boolean';

export interface AttrVal {
    code: string;
    value: string | number | boolean | string[] | null;
    type: AttrType;
    label?: string;
}

export interface Item {
    id: number;
    name: string;
    category_id: number;
    attributes: AttrVal[];
    last_modified?: string;
}

export interface ItemsResponse {
    products: Item[];
    total: number;
}

export interface SortConfig {
    field: keyof Item | '';
    direction: 'asc' | 'desc';
}

export interface FilterOpts {
    categoryId?: number;
    page: number;
    pageSize: number;
    sort?: SortConfig;
}