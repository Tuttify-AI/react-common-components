import { log } from './log';

const shouldIgnoreError = error => {
  if (!error) {
    return true;
  }

  if (error && error.message && error.message === 'Network Error') {
    return true;
  }

  return false;
};

export const onError = (error, source?) => {
  if (source) {
    log.error(source);
  }

  if (shouldIgnoreError(error)) {
    return;
  }

  log.error(error);
};
