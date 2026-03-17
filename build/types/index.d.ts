export declare type MessageData = Record<string, any>;
export declare type Nullable<T> = T | null;
export declare enum SocketEvents {
    disconnect = "disconnect",
    connect = "connect",
    reconnect = "reconnect",
    messageSent = "message.sent",
    connect_error = "connect_error",
    users = "users",
    userStatus = "user.status",
    roomsJoin = "rooms.join",
    roomsLeave = "rooms.leave"
}
export interface ChatMessage {
    _id: string;
    room_id: string;
    type: string;
    from_user: string;
    created_at: string;
    updated_at?: string;
    payload?: MessageData;
}
export declare type ValueOf<T> = T[keyof T];
