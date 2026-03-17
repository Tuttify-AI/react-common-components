import { Socket } from 'socket.io-client';
import { ChatMessage, MessageData, Nullable } from 'src/types';
import useSetupSocket from '../use-setup-socket';
export declare type UseChatMessagesReturnValues = ReturnType<typeof useChatMessages>;
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
declare function useChatMessages(socket: Socket | null, subscribeToConnect?: ReturnType<typeof useSetupSocket>['subscribeToConnect'], roomId?: string, { addRoomMember, fetchMessages, showLogs }?: UseChatMessagesParams): ChatMessage[];
export default useChatMessages;
