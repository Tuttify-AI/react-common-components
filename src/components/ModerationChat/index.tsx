import React, { FC, useEffect, useRef, useState } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import cx from 'classnames';
import { ModerationMessage } from 'src/types/message';
import './index.scss';
import { Send } from '@material-ui/icons';

type Props = {
  data: ModerationMessage[];
  send: (message: string) => Promise<void>;
  hide?: boolean;
};

const ModerationChat: FC<Props> = ({ data, send, hide = false }) => {
  const messages = data;

  const messagesRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  const onSendClicked = () => {
    send(newMessage);
    setNewMessage('');
  };

  useEffect(() => {
    if (messagesRef?.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={cx('moderation-chat-container', {
        hidden: hide,
      })}
    >
      <div ref={messagesRef} className="messages">
        {messages?.map(message => (
          <div key={message._id} className="message">
            <div>
              <strong>{`${message.from_user_data.first_name} ${message.from_user_data?.last_name?.[0]}`}</strong>:
            </div>
            <div>{message.payload.additionalProp1}</div>
            <div>{formatRelative(parseISO(message.created_at), new Date())}</div>
          </div>
        ))}
      </div>

      <div className="form">
        <textarea placeholder="Type your comment" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        {newMessage?.length > 0 && (
          <button onClick={() => onSendClicked()}>
            <Send />
          </button>
        )}
      </div>
    </div>
  );
};

export default ModerationChat;
