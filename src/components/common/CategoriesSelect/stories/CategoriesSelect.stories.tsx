import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CategoriesSelect from '..';

export default {
  title: 'Common Components/CategoriesSelect',
  component: CategoriesSelect,
  args: {
    categoriesState: {
      category: null,
      subCategory: null,
      subSubCategory: null,
    },
    updateCategoriesState: () => () => null,
    categories: [
      {
        name: 'cat1',
        subcategories: [
          {
            name: 'subCat1',
            subcategories: [
              {
                name: 'subSubCat1',
              },
            ],
          },
        ],
      },
      {
        name: 'cat2',
      },
    ],
    labelCategory: 'Category',
    labelSubCategory: 'Sub Category',
    labelSubSubCategory: 'Sub Sub Category',
  },
} as ComponentMeta<typeof CategoriesSelect>;

const Template: ComponentStory<typeof CategoriesSelect> = args => <CategoriesSelect {...args} />;

export const Primary = Template.bind({});
