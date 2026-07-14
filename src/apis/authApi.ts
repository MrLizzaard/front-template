import users from "../data/users.json";
import { createMockToken } from "../utils/jwt";

export interface LoginParams {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
  auth: string;
}

export interface LoginApiError {
  message: string;
}

const MOCK_DELAY = 300;

export const loginApi = ({ userId, password }: LoginParams): Promise<LoginResponse> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchedUser = users.find(
        (user) => user.id === userId && user.pw === password
      );

      if (!matchedUser) {
        reject({
          message: "아이디 또는 비밀번호가 올바르지 않습니다.",
        } satisfies LoginApiError);
        return;
      }

      const token = createMockToken({
        idx: matchedUser.idx,
        id: matchedUser.id,
        userName: matchedUser.userName,
        auth: matchedUser.auth,
      });

      resolve({ token, userName: matchedUser.userName, auth: matchedUser.auth });
    }, MOCK_DELAY);
  });
