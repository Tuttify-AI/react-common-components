import { ComponentMeta } from '@storybook/react';
import React from 'react';
declare const _default: ComponentMeta<React.FC<{
    data: import("../../../types/message").ModerationMessage[];
    send: (message: string) => Promise<void>;
    hide?: boolean | undefined;
}>>;
export default _default;
export declare const Primary: (args: any) => JSX.Element;
export declare const ManyMessages: (args: any) => JSX.Element;
export declare const Hidden: (args: any) => JSX.Element;
