- [Installation](#installation)
- [Hooks](#hooks)
  - [usePrevious](#useprevious)
  - [useSetupSocket](#usesetupsocket)
  - [useInfiniteCursorPagination](#useinfinitecursorpagination)
  - [useChatMessages](#usechatmessages)
  - [useRefreshToken](#userefreshtoken)


# EDU common components 

## Installation

`npm install @blipiqlabs/react-common-components --save`

or 

`yarn add @blipiqlabs/react-common-components`

## Hooks

# `usePrevious`

React hook that returns the previous value as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).

### Usage

```jsx
import React, {useEffect, useState} from "react";
import {usePrevious} from "@blipiqlabs/react-common-components";

const Demo = () => {
    const [count, setCount] = useState(0);
    const prevCount = usePrevious(count);

    return (
        <p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
            <p>
                Now: {count}, before: {prevCount}
            </p>
        </p>
    );
};
```

### Reference

```ts
const prevValue = usePrevious<P>(value: P): P | undefined
```


## `useSetupSocket`

React hook that returns socket instance and all subscription events

### Usage

```tsx
import React from "react";
import {usePrevious} from "@blipiqlabs/react-common-components";
//... other imports

const SocketWrapper: React.FC = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const token = getToken();
    const socketData = useSetupSocket(SOCKET_API_URL, { token, isLoggedIn });
    return <SocketContext.Provider value={socketData}>{children}</SocketContext.Provider>;
};
```

### Reference

```ts
const socketData = useSetupSocket({
    socketURL: string,
    isLoggedIn?: boolean,
    token?: string,
    socketOpts?: Partial<ManagerOptions & SocketOptions>,
    showLogs?: boolean,
});
```

- `socketURL` &mdash; websocket url, it is `reqiured`.
- `isLoggedIn` &mdash; user auth status, default - `false`.
- `token` &mdash; token used in socket connection.
- `socketOpts` &mdash; Socket io instance options, default - `{}`.
- `showLogs` &mdash; if `true` show logs for socket events (connect, disconnect, etc.), default - `true`.

## `useInfiniteCursorPagination`

React hook for infinite GraphQL cursor pagination

### Reference

```ts
const { handleChange } = useInfiniteCursorPagination({
    onFetchMore: (after: Nullable<string>) => void,
    after: Nullable<string>,
    currentId: Nullable<string>, 
    isLoading: boolean,
})
```

- `onFetchMore` &mdash; additional data fetching function.
- `after` &mdash; cursor pagination element id.
- `isLoading` &mdash; loading indicator.
- `currentId` &mdash; current or visible element id.

## `useChatMessages`

React hook for getting chat messages

### Reference

```ts
const messages = useChatMessages(
    socket,
    subscribeToConnect,
    roomId, {
    addRoomMember: (roomId: string) => Promise<Nullable<void>>,
    fetchMessages: <T = ChatMessage[]>(roomId: string, data?: MessageData) => Promise<T>,
    showLogs: boolean,
})
```

- `socket` &mdash; socket instance.
- `subscribeToConnect` &mdash; connection subscribe function.
- `roomId` &mdash; chat room id.
- `addRoomMember` &mdash; additional data fetching function.
- `fetchMessages` &mdash; cursor pagination element id.
- `showLogs` &mdash; loading indicator.

## `useRefreshToken`

React hook for token expiration time checking and refreshing whe user is active and if allowCheck is `true`'

### Reference

```ts
useRefreshTokenHook({
  onError,
  onTokenRefresh,
  allowCheck,
});
```

- `checkInterval` &mdash; interval for checking token expiration (in seconds).
- `refreshTime` &mdash; token left lifetime before refreshing.
- `allowCheck` &mdash; if true - enabling token check.
- `onError` &mdash; function that would be called on error.
- `onTokenRefresh` &mdash; token refresh function.
- `disableUserActivityCheck` &mdash; if true - user activity check is disabled.