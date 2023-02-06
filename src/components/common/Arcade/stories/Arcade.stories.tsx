import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Arcade } from '../Arcade';

export default {
  title: 'Common Components/Arcade',
  component: Arcade,
  args: {
    url: 'https://demo.arcade.software/drO3uWagHSH0KXbdVdNf?embed',
    open: true,
  },
} as ComponentMeta<typeof Arcade>;

const Template: ComponentStory<typeof Arcade> = args => <Arcade {...args} />;

export const Primary = Template.bind({});
