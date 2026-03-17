import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { MessageData, Nullable, SocketEvents } from 'src/types';
export declare type UseSetupSocketReturnValues = ReturnType<typeof useSetupSocket>;
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
declare function useSetupSocket(socketUrl: string, { isLoggedIn, showLogs, token, socketOpts }?: UseSetupSocketParams): {
    subscribeToEvent: <T>(event: SocketEvents) => (callback: (data: T) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToConnect: (callback: (data: void) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToConnectError: (callback: (data: Error) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToMessage: (callback: (data: MessageData) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToUsersEvent: (callback: (data: MessageData) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToJoinRoomEvent: (callback: (data: MessageData) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToLeaveRoomEvent: (callback: (data: MessageData) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    subscribeToUserStatusEvent: (callback: (data: MessageData) => void) => () => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> | undefined;
    socket: Nullable<Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>>;
};
export default useSetupSocket;
