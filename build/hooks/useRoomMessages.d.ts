import { ModerationMessage } from 'src/types/message';
declare const useRoomMessages: (roomId: string, fetchMessages: (roomId: string, data?: Record<string, unknown>) => Promise<ModerationMessage[]>, sendChatMessage: (roomId: string, type: string, data: Record<string, unknown>) => Promise<void>) => {
    data: ModerationMessage[];
    loading: boolean;
    error: unknown;
    fetch: () => Promise<void>;
    send: (message: string) => Promise<void>;
};
export default useRoomMessages;
