import './index.scss';
export interface Props {
    url: string;
    open: boolean;
    onClose: () => void;
}
export declare const Arcade: ({ url, open, onClose }: Props) => JSX.Element | null;
