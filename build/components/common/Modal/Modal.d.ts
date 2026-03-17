import React from 'react';
import './index.scss';
export interface Props {
    children: React.ReactNode;
    open: boolean;
}
export declare const Modal: ({ children, open }: Props) => JSX.Element | null;
