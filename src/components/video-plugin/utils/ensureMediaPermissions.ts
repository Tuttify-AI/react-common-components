import { onError } from './onError';

export interface Permissions {
  audio_permission_denied: boolean;
  video_permission_denied: boolean;
}

export const ensureMediaPermissions = (): Promise<Permissions> => {
  if (!navigator.mediaDevices.enumerateDevices) {
    const error = new Error('Your browser does not support media streaming');
    return Promise.reject(error);
  }

  return navigator.mediaDevices.enumerateDevices().then(() => {
    return Promise.all([
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(mediaStream => {
          mediaStream.getTracks().forEach(track => {
            track.stop();
          });

          return {
            denied: false,
          };
        })
        .catch(error => {
          onError(error, 'enumerateDevices - harmless');

          if (error.message) {
            let message: string = error.message;
            message = message.toLowerCase();
            if (message.includes('permission denied')) {
              return {
                denied: true,
              };
            }
          }

          return {
            denied: false,
          };
        }),
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(mediaStream => {
          mediaStream.getTracks().forEach(track => {
            track.stop();
          });

          return {
            denied: false,
          };
        })
        .catch(error => {
          onError(error, 'enumerateDevices - harmless');

          if (error.message) {
            let message: string = error.message;
            message = message.toLowerCase();
            if (message.includes('permission denied')) {
              return {
                denied: true,
              };
            }
          }

          return {
            denied: false,
          };
        }),
    ]).then(([a, v]: { denied: boolean }[]) => {
      const result = {
        audio_permission_denied: a.denied,
        video_permission_denied: v.denied,
      };

      return result;
    });
  });
};
