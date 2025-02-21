import { SortOrder } from 'mongoose';
import Category, { ICategoryDocument } from '../models/category';

export const CategoryRepository = {
  async create(data: Partial<ICategoryDocument>) {
    try {
      const category = new Category(data);
      await category.save();
      return;
    } catch (error: any) {
      throw error;
    }
  },

  async getFilteredAndPaginatedCategories(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    const categories = await Category.find(filter, { __v: 0 })
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder });

    const total = await Category.countDocuments(filter);

    return { categories, total };
  },

  async findById(id: string) {
    return Category.findById(id, { __v: 0 });
  },

  async deleteById(id: string) {
    return Category.findByIdAndDelete(id);
  },
};
