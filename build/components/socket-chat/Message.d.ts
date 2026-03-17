import React from 'react';
export interface MessageProps {
    userId: string;
    text: string;
    isMe?: boolean;
    getUser: (userId: string) => any;
}
declare const Message: React.FC<MessageProps>;
export default Message;
