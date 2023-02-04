import { waitUntil } from './waitUntil';
import { day } from '../types';
import { log } from './log';
const visible = require('ifvisible.js');

export const waitUntilActive = () => {
  return waitUntil(
    () => {
      const result = !visible.now('hidden');

      log.info(`wait until active ${result}`);

      return Promise.resolve(result);
    },
    day,
    500
  );
};
