import { FC } from 'react';
import { ModerationMessage } from 'src/types/message';
import './index.scss';
declare type Props = {
    data: ModerationMessage[];
    send: (message: string) => Promise<void>;
    hide?: boolean;
};
declare const ModerationChat: FC<Props>;
export default ModerationChat;
