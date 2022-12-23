import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

export interface MessageProps {
  userId: string;
  text: string;
  isMe?: boolean;
  getUser: (userId: string) => any;
}

const Message: React.FC<MessageProps> = ({ userId, text, isMe, getUser }) => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const getUserInfo = useCallback(
    async (userId: string) => {
      if (userId) {
        const user = await getUser(userId);
        setUserInfo(user);
      }
    },
    [userId, getUser]
  );

  useEffect(() => {
    if (userId) {
      getUserInfo(userId);
    }
  }, [userId]);

  const avatarUrl = useMemo(() => {
    if (userInfo?.user?.profile_image) {
      return userInfo.user.profile_image;
    }
    return `https://ui-avatars.com/api/?background=random&name=${userInfo?.user?.first_name}+${userInfo?.user?.last_name}&color=#fff`;
  }, [userInfo]);

  return (
    <div className={classNames({ 'chat-item': true, 'my-item': isMe })}>
      {!isMe && userInfo && <img alt="" className="profile-image" width="32" height="32" src={avatarUrl} />}

      <div className={classNames({ 'message-wrapper': true, 'my-message': isMe })}>
        <div className="username">
          <strong>
            {userInfo?.user?.first_name} {userInfo?.user?.last_name}
          </strong>
        </div>
        <div className="message">{text}</div>
      </div>
    </div>
  );
};

export default Message;
