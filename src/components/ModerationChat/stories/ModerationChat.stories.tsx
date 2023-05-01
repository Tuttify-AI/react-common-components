import { ComponentMeta } from '@storybook/react';
import React from 'react';
import ModerationChat from '..';

export default {
  title: 'ModerationChat',
  component: ModerationChat,
  args: {
    data: [
      {
        from_user_data: {
          first_name: 'Michelle',
          last_name: 'Too',
        },
        payload: {
          additionalProp1:
            'Some changes were made. Please check to see if these animals are playful enough or if they are too aggressive looking.',
        },
        created_at: '2023-02-10T10:45:00Z',
      },
      {
        from_user_data: {
          first_name: 'Joanna',
          last_name: 'Doo',
        },
        payload: {
          additionalProp1: 'Show exercises where students match animal sounds to animals',
        },
        created_at: '2023-02-10T17:30:52Z',
      },
      {
        from_user_data: {
          first_name: 'Michelle',
          last_name: 'Too',
        },
        payload: {
          additionalProp1: 'I’ll take care of this slide.',
        },
        created_at: '2023-02-11T19:00:52Z',
      },
    ],
    // eslint-disable-next-line
    send: (str: string) => {
      //
    },
  },
} as ComponentMeta<typeof ModerationChat>;

export const Primary = args => <ModerationChat {...args} />;

export const ManyMessages = args => <ModerationChat {...args} data={[...args.data, ...args.data, ...args.data]} />;

export const Hidden = args => <ModerationChat {...args} hide />;
