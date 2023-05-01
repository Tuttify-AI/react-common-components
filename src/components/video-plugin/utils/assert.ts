import { log } from './log';

export const assert = (cond, msg) => {
  if (!cond) {
    log.error(msg);
  }
};
