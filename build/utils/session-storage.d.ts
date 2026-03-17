export declare enum StorageKeys {
    tabId = "tabId"
}
export declare const getStorageValue: (key: StorageKeys) => string | null;
export declare const setStorageValue: (key: StorageKeys, value?: string) => void;
export declare const getTabId: () => string | null;
export declare const saveTabId: (tabId: string) => void;
