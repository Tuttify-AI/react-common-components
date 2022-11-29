import { useCallback, useEffect, useState } from 'react';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { MessageData, Nullable, SocketEvents } from 'src/types';
import usePrevious from 'src/hooks/use-previous';

export type UseSetupSocketReturnValues = ReturnType<typeof useSetupSocket>;

export interface UseSetupSocketParams {
  /**
   * user auth status
   */
  isLoggedIn?: boolean;
  /**
   * token used in socket connection
   */
  token?: string | null;
  /**
   * Socket io instance options
   */
  socketOpts?: Partial<ManagerOptions & SocketOptions>;
  /**
   * if true = show logs for socket events (connect, disconnect, etc.)
   */
  showLogs?: boolean;
}

const DEFAULT_OPTIONS = {};

const DEFAULT_PARAMS: UseSetupSocketParams = {
  isLoggedIn: false,
  socketOpts: DEFAULT_OPTIONS,
};

function useSetupSocket(
  socketUrl: string,
  { isLoggedIn = false, showLogs = true, token, socketOpts = DEFAULT_OPTIONS }: UseSetupSocketParams = DEFAULT_PARAMS
) {
  const [socket, setSocket] = useState<Nullable<Socket>>(null);
  const prevToken = usePrevious(token);

  useEffect(() => {
    if (!socket && isLoggedIn) {
      setSocket(
        io(socketUrl, {
          reconnection: true,
          autoConnect: true,
          transports: ['websocket'],
          closeOnBeforeunload: false,
          query: {
            ...(token ? { token } : {}),
          },
          ...socketOpts,
        })
      );
      if (showLogs) {
        // eslint-disable-next-line no-console
        showLogs && console.log('socket connection established');
      }
    }
  }, [socket, isLoggedIn, setSocket, showLogs, token, socketOpts, socketUrl]);

  useEffect(() => {
    if (token && prevToken && prevToken !== token) {
      showLogs && console.log('socket connection close on token change');
      socket?.close();
      setSocket(null);
    }
  }, [token, prevToken, socket, setSocket, showLogs]);

  useEffect(() => {
    if (socket && !isLoggedIn) {
      socket.close();
      // eslint-disable-next-line no-console
      showLogs && console.log('socket connection close on logout');
      setSocket(null);
    }
  }, [isLoggedIn, showLogs, socket]);

  const subscribeToEvent = useCallback(
    <T>(event: SocketEvents) =>
      (callback: (data: T) => void) => {
        socket?.on(event, callback);
        return () => socket?.off(event, callback);
      },

    [socket]
  );

  useEffect(() => {
    if (socket) {
      socket.on(SocketEvents.disconnect, reason => {
        // eslint-disable-next-line no-console
        showLogs && console.log('socket connection lost', `reason ${reason}`);
      });

      socket.on(SocketEvents.connect, () => {
        // eslint-disable-next-line no-console
        showLogs && console.log('socket connect event fired', `socket id ${socket.id}`);
      });

      socket.on(SocketEvents.reconnect, () => {
        // eslint-disable-next-line no-console
        showLogs && console.log('socket was reconnected', `socket id ${socket.id}`);
      });
    }
  }, [socket, showLogs]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        // eslint-disable-next-line no-console
        showLogs && console.log('socket connection close on unmount');
        setSocket(null);
      }
    };
  }, [socket, setSocket, showLogs]);

  return {
    subscribeToEvent,
    subscribeToConnect: subscribeToEvent<void>(SocketEvents.connect),
    subscribeToConnectError: subscribeToEvent<Error>(SocketEvents.connect_error),
    subscribeToMessage: subscribeToEvent<MessageData>(SocketEvents.messageSent),
    subscribeToUsersEvent: subscribeToEvent<MessageData>(SocketEvents.users),
    subscribeToJoinRoomEvent: subscribeToEvent<MessageData>(SocketEvents.roomsJoin),
    subscribeToLeaveRoomEvent: subscribeToEvent<MessageData>(SocketEvents.roomsLeave),
    subscribeToUserStatusEvent: subscribeToEvent<MessageData>(SocketEvents.userStatus),
    socket,
  };
}

export default useSetupSocket;
