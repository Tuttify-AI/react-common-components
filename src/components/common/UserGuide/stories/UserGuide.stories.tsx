import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UserGuide } from '../UserGuide';

export default {
  title: 'Common Components/UserGuide',
  component: UserGuide,
  args: {
    text: 'Tap any card above to play a sound.',
    open: true,
  },
} as ComponentMeta<typeof UserGuide>;

const Template: ComponentStory<typeof UserGuide> = args => <UserGuide {...args} />;

export const Primary = Template.bind({});
