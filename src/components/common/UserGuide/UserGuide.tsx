import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import './index.scss';

export interface Props {
  text: string;
  open: boolean;
}

export const UserGuide = ({ text, open }: Props) => {
  const [isOpen, setIsOpen] = useState(open);
  const onClickCallback = () => {
    setIsOpen(false);
  };

  window.addEventListener('click', onClickCallback);

  useEffect(() => {
    return () => {
      window.removeEventListener('click', onClickCallback);
    };
  }, []);

  return (
    <div
      className={classnames('guide', {
        close: !isOpen,
      })}
      title={text}
      onClick={e => {
        setIsOpen(!isOpen);
        e.stopPropagation();
      }}
    >
      {isOpen && text}
    </div>
  );
};
