import React from 'react';
import { Category } from 'src/types/forms';
import { Grid } from '@material-ui/core';
import CategoryField from '../forms/Category';
import { ValueOf } from 'src/types';
import './index.scss';
import { CategoriesState } from './types';

type Props = {
  categoriesState: CategoriesState;
  updateCategoriesState: (type: keyof CategoriesState) => (value: ValueOf<CategoriesState>) => void;
  categories: Category[];
  labelCategory?: string;
  labelSubCategory?: string;
  labelSubSubCategory?: string;
};

const CategoriesSelect: React.FC<Props> = ({
  categoriesState,
  updateCategoriesState,
  categories,
  labelCategory,
  labelSubCategory,
  labelSubSubCategory,
}) => {
  return (
    <Grid item className="select-categories-container" sm={12}>
      <Grid item sm={4}>
        <CategoryField
          options={categories}
          value={categoriesState.category}
          onChange={updateCategoriesState('category')}
          label={labelCategory}
        />
      </Grid>
      {categoriesState.category?.subcategories?.length ? (
        <Grid item sm={4} style={{ margin: '0 20px' }}>
          <CategoryField
            options={categoriesState.category.subcategories}
            value={categoriesState.subCategory}
            onChange={updateCategoriesState('subCategory')}
            label={labelSubCategory}
          />
        </Grid>
      ) : null}
      {categoriesState.subCategory?.subcategories?.length ? (
        <Grid item sm={4}>
          <CategoryField
            options={categoriesState.subCategory.subcategories}
            value={categoriesState.subSubCategory}
            onChange={updateCategoriesState('subSubCategory')}
            label={labelSubSubCategory}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default CategoriesSelect;
