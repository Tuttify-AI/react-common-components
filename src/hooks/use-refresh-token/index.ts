import { useCallback, useEffect, useMemo, useRef } from 'react';
import throttle from 'lodash.throttle';

export interface UseRefreshTokenParams {
  /**
   * Interval for checking token expiration (in seconds)
   */
  checkInterval?: number;
  /**
   * Token left lifetime before refreshing
   */
  refreshTime?: number;
  /**
   * If true - enabling token check
   */
  allowCheck?: boolean;
  /**
   * Function that would be called on error
   */
  onError?: () => void;
  /**
   * Token refresh function
   */
  onTokenRefresh: (params: TokenRefreshParams) => Promise<void>;
  /**
   * If true - user activity check is disabled
   */
  disableUserActivityCheck?: boolean;
}

export type TokenRefreshParams = {
  tokenRefreshTime: number;
  isRefreshing: boolean;
  onRefreshStart: () => void;
  onRefreshEnd: () => void;
};

const DEFAULT_PARAMS: UseRefreshTokenParams = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTokenRefresh: () => new Promise<void>(() => {}),
};

export const REFRESH_TOKEN_PARAMS = {
  // in seconds
  checkInterval: 60,
  // in seconds
  refreshTime: 180,
};

let isRefreshing = false;
const onRefreshStart = () => {
  isRefreshing = true;
};
const onRefreshEnd = () => {
  isRefreshing = false;
};

function useRefreshToken({
  refreshTime,
  checkInterval,
  allowCheck = false,
  onError,
  onTokenRefresh,
  disableUserActivityCheck = false,
}: UseRefreshTokenParams = DEFAULT_PARAMS) {
  const tokenCheckInterval = useMemo(() => checkInterval || REFRESH_TOKEN_PARAMS.checkInterval, [checkInterval]);
  const tokenRefreshTime = useMemo(() => refreshTime || REFRESH_TOKEN_PARAMS.refreshTime, [refreshTime]);

  const onRefresh = useCallback(async () => {
    try {
      await onTokenRefresh({ tokenRefreshTime, isRefreshing, onRefreshStart, onRefreshEnd });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onRefreshEnd();
      onError && onError();
    }
  }, [onError, onTokenRefresh, tokenRefreshTime]);

  const throttledRefresh = useRef(throttle(onRefresh, 1000)).current;

  // refresh token if session/activity is ongoing
  useEffect(() => {
    async function checkToken() {
      if (allowCheck) {
        await onRefresh();
      }
    }
    const intervalId = setInterval(() => checkToken(), 1000 * tokenCheckInterval);
    return () => clearInterval(intervalId);
  }, [tokenCheckInterval, onRefresh, allowCheck]);

  // refresh token if user is active
  useEffect(() => {
    async function checkToken() {
      if (!disableUserActivityCheck) {
        await throttledRefresh();
      }
    }
    window.addEventListener('mousemove', checkToken);
    window.addEventListener('scroll', checkToken);
    window.addEventListener('keydown', checkToken);
    return () => {
      window.removeEventListener('mousemove', checkToken);
      window.removeEventListener('scroll', checkToken);
      window.removeEventListener('keydown', checkToken);
    };
  }, [throttledRefresh, disableUserActivityCheck]);
}

export default useRefreshToken;
