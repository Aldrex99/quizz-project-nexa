import { ICategory } from '../models/category';
import { CategoryRepository } from '../repositories/category';

export const createCategory = async (data: Partial<ICategory>) => {
  try {
    await CategoryRepository.create(data);
  } catch (error: any) {
    throw error;
  }
};

export const getCategories = async (
  filter: Record<string, any>,
  limit: number,
  page: number,
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
) => {
  const skip = limit * (page - 1);

  const categories = await CategoryRepository.getFilteredAndPaginatedCategories(
    filter,
    skip,
    limit,
    sortBy,
    sortOrder,
  );

  return categories;
};

export const getCategoryById = async (id: string) => {
  return CategoryRepository.findById(id);
};

export const deleteCategoryById = async (id: string) => {
  return CategoryRepository.deleteById(id);
};
