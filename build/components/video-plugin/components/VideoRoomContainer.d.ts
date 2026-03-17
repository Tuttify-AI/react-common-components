import { Component } from 'react';
declare type DraggableData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};
interface VideoRoomContainerProps {
    onContextMenu: (event: any, ref: any) => void;
    onDragStart: (e: any, d: DraggableData) => void;
    onDrag: (e: any, d: DraggableData) => void;
    onDragStop: (e: any, d: DraggableData) => void;
    onResizeStart: (e: any, dir: any, ref: any) => void;
    onResize: (e: any, direction: any, ref: any, delta: any, position: any) => void;
    onResizeStop: (e: any, direction: any, ref: any, delta: any, position: any) => void;
    disableDragging: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
}
export declare class VideoRoomContainer extends Component<VideoRoomContainerProps, Record<string, never>> {
    ref: any;
    constructor(props: any);
    render(): JSX.Element;
}
export {};
