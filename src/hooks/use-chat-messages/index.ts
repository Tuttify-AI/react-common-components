import { useCallback, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { ChatMessage, MessageData, Nullable } from 'src/types';
import useSetupSocket from '../use-setup-socket';

export type UseChatMessagesReturnValues = ReturnType<typeof useChatMessages>;

export interface UseChatMessagesParams {
  /**
   * connect user to the room
   * @param roomId chat room id
   */
  addRoomMember?: (roomId: string) => Promise<Nullable<void>>;
  /**
   * fetch chat messages
   * @param roomId chat room id
   * @param data additional parameters for messages fetching
   */
  fetchMessages?: <T = ChatMessage[]>(roomId: string, data?: MessageData) => Promise<T>;
  /**
   * if true = show logs for error events
   */
  showLogs?: boolean;
}

const DEFAULT_PARAMS = {};

function useChatMessages(
  socket: Socket | null,
  subscribeToConnect?: ReturnType<typeof useSetupSocket>['subscribeToConnect'],
  roomId?: string,
  { addRoomMember, fetchMessages, showLogs = true }: UseChatMessagesParams = DEFAULT_PARAMS
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  showLogs && console.log('useChatMessages messages:', messages);

  const getMessages = useCallback(
    async (roomId: string, messageData?: MessageData) => {
      try {
        showLogs && console.log('useChatMessages getMessages:', fetchMessages);
        if (fetchMessages) {
          const data = await fetchMessages(roomId, messageData);
          setMessages(data);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        showLogs && console.log('can`t fetch messages...');
      }
    },
    [fetchMessages, showLogs]
  );

  const onConnectToRoom = useCallback(
    async (roomId: string) => {
      try {
        showLogs && console.log('useChatMessages onConnectToRoom:', addRoomMember);
        if (addRoomMember) {
          await addRoomMember(roomId);
          await getMessages(roomId, { type: 'chat' });
          showLogs && console.log('useChatMessages a room member was added to', roomId);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        showLogs && console.log('can`t connect to the room...');
      }
    },
    [addRoomMember, getMessages, showLogs]
  );

  const handleConnectMember = useCallback(async () => {
    roomId && onConnectToRoom(roomId);
  }, [roomId, onConnectToRoom]);

  useEffect(() => {
    let unsubscribe;
    if (!socket?.id && subscribeToConnect) {
      unsubscribe = subscribeToConnect(handleConnectMember);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [handleConnectMember, socket, subscribeToConnect]);

  useEffect(() => {
    if (socket?.id && roomId) {
      onConnectToRoom(roomId);
    }
  }, [roomId, onConnectToRoom, socket]);

  return messages;
}

export default useChatMessages;
