import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Modal } from '../Modal';

export default {
  title: 'Common Components/Modal',
  component: Modal,
  args: {
    children: <div>this is a test modal</div>,
    open: true,
  },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = args => (
  <div style={{ background: '#fff' }}>
    <Modal {...args} />
  </div>
);

export const Primary = Template.bind({});
