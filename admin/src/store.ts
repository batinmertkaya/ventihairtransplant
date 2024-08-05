import { persistentAtom } from "@nanostores/persistent";

type Store = {
  token: string | null;
};

export const authStore = persistentAtom<Store>(
  "auth",
  {
    token: null,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export function login(token: string) {
  authStore.set({ token });
}

export function logout() {
  authStore.set({ token: null });
}
