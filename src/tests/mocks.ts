import { Product, AttributeValue } from '../types/product.types';
import { Category } from '../types/category.types';

// Mock products data
export const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Test Product 1',
        category_id: 1,
        attributes: [
            {
                code: 'color',
                value: 'Blue',
                type: 'text',
                label: 'Color'
            },
            {
                code: 'size',
                value: 42,
                type: 'number',
                label: 'Size'
            }
        ],
        last_modified: '2023-06-01T10:00:00Z'
    },
    {
        id: 2,
        name: 'Test Product 2',
        category_id: 2,
        attributes: [
            {
                code: 'material',
                value: 'Wood',
                type: 'text',
                label: 'Material'
            }
        ],
        last_modified: '2023-06-02T10:00:00Z'
    }
];

// Mock categories data
export const mockCategories: Category[] = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2', parent_id: 1 },
    { id: 3, name: 'Category 3' }
];

// Mock attributes
export const mockAttributes: AttributeValue[] = [
    {
        code: 'color',
        value: 'Red',
        type: 'text',
        label: 'Color'
    },
    {
        code: 'width',
        value: 100,
        type: 'number',
        label: 'Width (cm)'
    },
    {
        code: 'in_stock',
        value: true,
        type: 'boolean',
        label: 'In Stock'
    },
    {
        code: 'tags',
        value: ['modern', 'stylish'],
        type: 'tags',
        label: 'Tags'
    },
    {
        code: 'manual',
        value: 'https://example.com/manual.pdf',
        type: 'url',
        label: 'Manual'
    }
];

// Mock API response for product list
export const mockProductsResponse = {
    products: mockProducts,
    total: 2
};