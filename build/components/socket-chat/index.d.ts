import { FC } from 'react';
import 'react-virtualized/styles.css';
export interface SocketChatProps {
    socket: any;
    roomId: string;
    currentUserId: string;
    getUser: (id: string) => any;
    sendMsg: (text: string) => void;
    messages: any[];
    maxChatChar?: number | string;
    placeholder?: string;
    getQuestionListSummary: () => void;
    questionListSummary: {
        my_question_answered_count: number;
        friend_question_count: number;
    } | undefined;
    renderOnQuestionClick?: () => JSX.Element;
    setShowEnhancedLearning: (b: boolean) => void;
}
declare const SocketChat: FC<SocketChatProps>;
export default SocketChat;
