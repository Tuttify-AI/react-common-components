import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CategoryField from '..';

export default {
  title: 'Common Components/Category',
  component: CategoryField,
  args: {
    options: [
      {
        name: 'cat1',
      },
      {
        name: 'cat2',
      },
    ],
    label: 'Category',
  },
} as ComponentMeta<typeof CategoryField>;

const Template: ComponentStory<typeof CategoryField> = args => <CategoryField {...args} />;

export const Primary = Template.bind({});
