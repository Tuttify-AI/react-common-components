import { useCallback, useState } from 'react';
import { ValueOf } from 'src/types';
import { CategoriesState } from './types';

const useCategoriesSelect = (InitialValues?: CategoriesState) => {
  const [categoriesState, setCategoriesState] = useState<CategoriesState>(
    InitialValues ?? {
      category: null,
      subCategory: null,
      subSubCategory: null,
    }
  );

  const updateCategoriesState = useCallback(
    (type: keyof typeof categoriesState) => (value: ValueOf<typeof categoriesState>) => {
      setCategoriesState(prevFilter => ({
        ...prevFilter,
        [type]: value,
        ...(type === 'category' && { subCategory: null, subSubCategory: null }),
        ...(type === 'subCategory' && { subSubCategory: null }),
      }));
    },
    []
  );

  return { categoriesState, updateCategoriesState };
};

export default useCategoriesSelect;
