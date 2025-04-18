import { getStuff } from './httpService';
import { Category } from '../types/category.types';

export const fetchCategories = async (): Promise<Category[]> => {
    return getStuff<Category[]>('/categories');
};