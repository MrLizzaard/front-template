const REMEMBERED_ID_KEY = "rememberedId";

export const getRememberedId = (): string | null =>
  localStorage.getItem(REMEMBERED_ID_KEY);

export const setRememberedId = (userId: string): void => {
  localStorage.setItem(REMEMBERED_ID_KEY, userId);
};

export const clearRememberedId = (): void => {
  localStorage.removeItem(REMEMBERED_ID_KEY);
};
