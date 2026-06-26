import { Platform } from "react-native";
import type { TokenCache } from "@clerk/clerk-expo";

// ponytail: web uses in-memory storage since expo-secure-store is unavailable
const isWeb = Platform.OS === "web";

function getStore() {
  if (isWeb) {
    const store = new Map<string, string>();
    return {
      getItemAsync: (k: string) => Promise.resolve(store.get(k) ?? null),
      setItemAsync: (k: string, v: string) => { store.set(k, v); return Promise.resolve(); },
      deleteItemAsync: (k: string) => { store.delete(k); return Promise.resolve(); },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SecureStore = require("expo-secure-store");
  return SecureStore;
}

const store = getStore();

export const tokenCache: TokenCache = {
  async getToken(key: string) { return store.getItemAsync(key); },
  async saveToken(key: string, value: string) { return store.setItemAsync(key, value); },
  async clearToken(key: string) { store.deleteItemAsync(key); },
};