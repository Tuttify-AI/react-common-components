export enum StorageKeys {
  tabId = 'tabId',
}

export const getStorageValue = (key: StorageKeys) => sessionStorage.getItem(StorageKeys[key]);

export const setStorageValue = (key: StorageKeys, value?: string) => {
  value && sessionStorage.setItem(StorageKeys[key], value);
};

export const getTabId = () => getStorageValue(StorageKeys.tabId);

export const saveTabId = (tabId: string) => {
  setStorageValue(StorageKeys.tabId, tabId);
};
