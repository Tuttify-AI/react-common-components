import React from 'react';
import { Category } from 'src/types/forms';
import { ValueOf } from 'src/types';
import './index.scss';
import { CategoriesState } from './types';
declare type Props = {
    categoriesState: CategoriesState;
    updateCategoriesState: (type: keyof CategoriesState) => (value: ValueOf<CategoriesState>) => void;
    categories: Category[];
    labelCategory?: string;
    labelSubCategory?: string;
    labelSubSubCategory?: string;
    required?: boolean;
};
declare const CategoriesSelect: React.FC<Props>;
export default CategoriesSelect;
