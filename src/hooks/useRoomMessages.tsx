import { useCallback, useEffect, useState } from 'react';
import { ModerationMessage } from 'src/types/message';

const useRoomMessages = (
  roomId: string,
  fetchMessages: (roomId: string, data?: Record<string, unknown>) => Promise<ModerationMessage[]>,
  sendChatMessage: (roomId: string, type: string, data: Record<string, unknown>) => Promise<void>
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ModerationMessage[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const fetch = useCallback(async () => {
    if (!roomId) {
      return;
    }

    try {
      setLoading(true);
      const messages = await fetchMessages(roomId);
      setData(messages);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(e);
    }

    // eslint-disable-next-line
  }, [roomId]);

  const send = useCallback(
    async (message: string) => {
      if (!roomId) {
        return;
      }

      const messageProcessed = message.trim();
      if (!messageProcessed) {
        return;
      }

      try {
        setLoading(true);
        await sendChatMessage(roomId, 'moderation-chat', {
          additionalProp1: messageProcessed,
        });
        setLoading(false);
        fetch();
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    },

    // eslint-disable-next-line
    [roomId, fetch]
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, fetch, send };
};

export default useRoomMessages;
