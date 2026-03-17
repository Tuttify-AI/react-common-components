import { ValueOf } from 'src/types';
import { CategoriesState } from './types';
declare const useCategoriesSelect: (InitialValues?: CategoriesState) => {
    categoriesState: CategoriesState;
    updateCategoriesState: (type: keyof CategoriesState) => (value: ValueOf<CategoriesState>) => void;
};
export default useCategoriesSelect;
