import React from 'react';
import { Modal } from '../Modal';

import './index.scss';

export interface Props {
  url: string;
  open: boolean;
}

export const Arcade = ({ url, open }: Props) => {
  return (
    <Modal open={open}>
      <iframe className="arcadeFrame" src={url} />
    </Modal>
  );
};
