import { Category } from 'src/types/forms';

export type CategoriesState = {
  category: Category | null;
  subCategory: Category | null;
  subSubCategory: Category | null;
};
