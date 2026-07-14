const TOKEN_KEY = "accessToken";

const getStorage = (): Storage =>
  import.meta.env.VITE_JWT_STORAGE_LOCATION === "sessionStorage"
    ? sessionStorage
    : localStorage;

export const getToken = (): string | null => getStorage().getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  getStorage().setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  getStorage().removeItem(TOKEN_KEY);
};
