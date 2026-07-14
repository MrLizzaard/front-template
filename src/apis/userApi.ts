import usersData from "../data/users.json";

export interface UserListItem {
  idx: number;
  id: string;
  userName: string;
  auth: string;
}

export interface UserListParams {
  id?: string;
  userName?: string;
  auth?: string;
}

export type UserFormValues = Omit<UserListItem, "idx">;

const MOCK_DELAY = 300;

// users.json은 정적 임포트라 원본 배열을 직접 변형할 수 없으므로
// 별도의 메모리 저장소에 복사해두고 CRUD는 이 저장소를 대상으로 동작시킨다.
let userStore: UserListItem[] = usersData.map(({ idx, id, userName, auth }) => ({
  idx,
  id,
  userName,
  auth,
}));

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));

export const getUserListApi = (
  params: UserListParams = {}
): Promise<UserListItem[]> => {
  const { id, userName, auth } = params;

  const filtered = userStore
    .filter((user) => !id || user.id.includes(id))
    .filter((user) => !userName || user.userName.includes(userName))
    .filter((user) => !auth || user.auth === auth);

  return delay(filtered);
};

export const createUserApi = (values: UserFormValues): Promise<UserListItem> => {
  const nextIdx = userStore.reduce((max, user) => Math.max(max, user.idx), 0) + 1;
  const created: UserListItem = { idx: nextIdx, ...values };
  userStore = [...userStore, created];
  return delay(created);
};

export const updateUserApi = (values: UserListItem): Promise<UserListItem> => {
  userStore = userStore.map((user) => (user.idx === values.idx ? values : user));
  return delay(values);
};

export const deleteUserApi = (idx: number): Promise<number> => {
  userStore = userStore.filter((user) => user.idx !== idx);
  return delay(idx);
};
