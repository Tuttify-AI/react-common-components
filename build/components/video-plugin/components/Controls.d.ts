import { Component } from 'react';
interface ControlsProps {
    audioEnabled: boolean;
    videoEnabled: boolean;
    style: any;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    endCall: () => void;
}
export declare class Controls extends Component<ControlsProps, Record<string, never>> {
    mounted: boolean;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
