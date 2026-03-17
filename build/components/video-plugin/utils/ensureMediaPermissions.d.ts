export interface Permissions {
    audio_permission_denied: boolean;
    video_permission_denied: boolean;
}
export declare const ensureMediaPermissions: () => Promise<Permissions>;
