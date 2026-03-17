import { Component } from 'react';
interface ContextMenuItemProps {
    title: string;
    id: string;
    onClick: (e: any) => void;
    highlighted: boolean;
    disabled?: boolean;
}
export declare class ContextMenuItem extends Component<ContextMenuItemProps, Record<string, never>> {
    render(): JSX.Element;
}
export {};
