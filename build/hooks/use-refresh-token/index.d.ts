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
export declare type TokenRefreshParams = {
    tokenRefreshTime: number;
    isRefreshing: boolean;
    onRefreshStart: () => void;
    onRefreshEnd: () => void;
};
export declare const REFRESH_TOKEN_PARAMS: {
    checkInterval: number;
    refreshTime: number;
};
declare function useRefreshToken({ refreshTime, checkInterval, allowCheck, onError, onTokenRefresh, disableUserActivityCheck, }?: UseRefreshTokenParams): void;
export default useRefreshToken;
