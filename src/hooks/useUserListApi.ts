import { useMutation } from "@tanstack/react-query";
import {
  getUserListApi,
  type UserListItem,
  type UserListParams,
} from "../apis/userApi";

const useUserListApi = () =>
  useMutation<UserListItem[], unknown, UserListParams>({
    mutationFn: getUserListApi,
  });

export default useUserListApi;
