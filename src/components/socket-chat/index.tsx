import React, { FC, Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';

import Message from './Message';
import SmileIcon from '../icons/SmileIcon';
import NextArrowIcon from '../icons/NextArrowIcon';
import MessageIcon from '../icons/MessageIcon';
import QuestionIcon from '../icons/QuestionIcon';
import CloseIcon from '../icons/CloseIcon';

import 'react-virtualized/styles.css';
import useInterval from 'src/hooks/use-interval';

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
  questionListSummary: { my_question_answered_count: number; friend_question_count: number } | undefined;
}

const SocketChat: FC<SocketChatProps> = ({
  socket,
  roomId,
  currentUserId,
  getUser,
  sendMsg,
  messages,
  maxChatChar = 300,
  placeholder = 'Type your message',
  getQuestionListSummary,
  questionListSummary,
}) => {
  const [ioSocket, setIoSocket] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>(messages);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);

  console.log('SocketChat, roomId:', roomId);

  useEffect(() => {
    // call once on initialize
    getQuestionListSummary();
  }, [getQuestionListSummary]);

  const HALF_MINUTE_MS = 30000;
  // keep fetching summary every 30 seconds
  useInterval(getQuestionListSummary, HALF_MINUTE_MS);

  const msgInput = useRef<HTMLInputElement>(null);

  const toggleChat = useCallback(() => {
    if (showMobileChat) {
      setShowMobileInput(false);
    }
    setShowMobileChat(!showMobileChat);
  }, [setShowMobileChat, showMobileChat]);

  const sendMessage = useCallback(async () => {
    if (!showMobileInput) {
      setShowMobileInput(true);
    }

    msgInput?.current?.focus();

    if (msgInput?.current?.value) {
      sendMsg(msgInput.current.value);
      msgInput.current.value = '';
    }
  }, [showMobileInput, setShowMobileInput, msgInput, sendMsg]);

  const handleMessageSent = useCallback(data => {
    if (!data.message.type || data.message?.type === 'chat') {
      setChatHistory(prev => [...prev, data.message]);
    }
  }, []);

  const handleMessageList = useCallback((data: any) => {
    setChatHistory(data);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    if (ioSocket) {
      ioSocket.on('messages.list', handleMessageList);
    }
    return () => {
      ioSocket?.off('messages.list', handleMessageList);
    };
  }, [ioSocket, handleMessageList]);

  useEffect(() => {
    if (ioSocket) {
      ioSocket.on('message.sent', handleMessageSent);
    }
    return () => {
      ioSocket?.off('message.sent', handleMessageSent);
    };
  }, [ioSocket, handleMessageSent]);

  useEffect(() => {
    if (socket) {
      setIoSocket(socket);
      setChatHistory([]);
    }
  }, [socket]);

  useEffect(() => {
    setChatHistory(messages);
  }, [messages]);

  const isMobile = useMediaQuery({
    query: '(max-device-width: 767px)',
  });

  if (!chatHistory) return null;

  const rowRenderer = ({
    // key, // Unique key within array of rows
    index, // Index of row within collection
    // isScrolling, // The List is currently being scrolled
    // isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style,
  }: any) => {
    return (
      <div key={index} style={style}>
        <Message
          key={index}
          text={chatHistory[index]?.payload?.text}
          userId={chatHistory[index]?.from_user}
          isMe={currentUserId === chatHistory[index].from_user}
          getUser={getUser}
        />
      </div>
    );
  };

  const handleRowHeight = useCallback(
    ({ index: number }) => {
      const text = chatHistory[number]?.payload?.text;
      let length = 48;
      if (text) {
        length = Math.ceil(String(text).length / 40) * 16 + 48;
      }
      return length;
    },
    [chatHistory]
  );

  return (
    <Fragment>
      <div
        className={classNames({
          'chat-container': true,
          'mobile-chat': showMobileChat,
        })}
      >
        <div className="chat-header">
          <div className="chat-title">Lesson name</div>
          <div className="notifications">
            <div className="question-mark">
              <QuestionIcon />
            </div>
            <div className="reads">{questionListSummary?.friend_question_count ?? 0}</div>
            <div className="un-reads">{questionListSummary?.my_question_answered_count ?? 0}</div>
            <div className="label">Help</div>
          </div>
        </div>

        <div onClick={toggleChat} className="close-wrapper">
          <CloseIcon />
        </div>

        <div className="chats">
          <AutoSizer className="auto-sizer">
            {({ height, width }) => (
              <List
                width={width}
                height={height - 30}
                rowHeight={handleRowHeight}
                rowCount={chatHistory?.length || 0}
                rowRenderer={rowRenderer}
                scrollToIndex={chatHistory.length - 1}
              />
            )}
          </AutoSizer>

          {showMobileInput || !isMobile ? (
            <div className="input-wrapper">
              <input
                autoFocus
                ref={msgInput}
                placeholder={placeholder}
                className="message-input"
                maxLength={Number(maxChatChar)}
                onKeyDown={handleKeyDown}
              />

              <div onClick={sendMessage} className="send-button">
                <NextArrowIcon />
              </div>

              <div className="emoji-open">
                <SmileIcon />
              </div>
            </div>
          ) : (
            <div onClick={sendMessage} className="send-toggle">
              <NextArrowIcon />
            </div>
          )}
        </div>
      </div>

      {!showMobileChat && (
        <div className="mobile-actions">
          <div onClick={toggleChat} className="message-container">
            <MessageIcon />
          </div>

          <div className="question-container">
            <QuestionIcon />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SocketChat;
