//import { Consola, BrowserReporter } from 'consola';
const consola = require('consola');

const getDatePrefix = () => {
  const date = new Date().toLocaleString();

  return date;
};

const logger: any = new consola.Consola({
  level: 5,
  reporters: [new consola.BrowserReporter()],
});

export const log = {
  success: (...args) => {
    logger.success(getDatePrefix(), ...args);
  },
  info: (...args) => {
    logger.info(getDatePrefix(), ...args);
  },
  warn: (...args) => {
    logger.warn(getDatePrefix(), ...args);
  },
  error: (error: any) => {
    logger.error(error);
  },
  json: (...args) => {
    logger.info(`JSON`, getDatePrefix(), ...args);
  },
  tag:
    (tag: string, type: `success` | `info` | `error` | `warn`) =>
    (...args) => {
      const tagged = logger.withTag(tag);

      if (tagged[type]) {
        tagged[type](getDatePrefix(), ...args);
      }
    },
};
