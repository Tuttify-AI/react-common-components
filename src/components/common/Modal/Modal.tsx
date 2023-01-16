import React from 'react';

import './index.scss';

export interface Props {
  children: React.ReactNode;
  open: boolean;
}

export const Modal = ({ children, open }: Props) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal">
      <div className="content">{children}</div>
    </div>
  );
};
