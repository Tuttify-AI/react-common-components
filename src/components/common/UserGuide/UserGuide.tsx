import React, { useState } from 'react';
import classnames from 'classnames';

import './index.scss';

export interface Props {
  text: string;
  close: boolean;
}

export const UserGuide = ({ text, close }: Props) => {
  const [isClose, setIsClose] = useState(close);
  return (
    <div
      className={classnames('guide', {
        close: isClose,
      })}
      onClick={() => setIsClose(!isClose)}
    >
      {!isClose && text}
    </div>
  );
};
