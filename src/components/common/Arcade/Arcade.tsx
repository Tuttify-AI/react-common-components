import React from 'react';

import './index.scss';

export interface Props {
  url: string;
  open: boolean;
  onClose: () => void;
}

export const Arcade = ({ url, open, onClose }: Props) => {
  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1001,
      }}
      onClick={() => onClose()}
    >
      <div
        style={{
          width: '50%',
          height: 'calc(61.416666666666664% + 41px)',
          position: 'relative',
        }}
        onClick={() => onClose()}
      >
        <iframe className="arcadeFrame" src={url} />
      </div>
    </div>
  );
};
