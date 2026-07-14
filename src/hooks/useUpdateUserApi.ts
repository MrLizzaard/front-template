import { useMutation } from "@tanstack/react-query";
import { updateUserApi, type UserListItem } from "../apis/userApi";

const useUpdateUserApi = () =>
  useMutation<UserListItem, unknown, UserListItem>({
    mutationFn: updateUserApi,
  });

export default useUpdateUserApi;
