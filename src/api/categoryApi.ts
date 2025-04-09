import { get } from './apiClient';
import { Category } from '../types/category.types';

export const fetchCategories = async (): Promise<Category[]> => {
    return get<Category[]>('/categories');
};