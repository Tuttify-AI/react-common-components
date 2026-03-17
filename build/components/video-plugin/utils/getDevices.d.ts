export declare const selectDefaultMicrophone: (audioDevices: MediaDeviceInfo[]) => MediaDeviceInfo | null | undefined;
export declare const getDevices: () => Promise<{
    videoDevices: MediaDeviceInfo[];
    audioDevices: MediaDeviceInfo[];
}>;
