import { useMutation } from "@tanstack/react-query";
import {
  createUserApi,
  type UserFormValues,
  type UserListItem,
} from "../apis/userApi";

const useCreateUserApi = () =>
  useMutation<UserListItem, unknown, UserFormValues>({
    mutationFn: createUserApi,
  });

export default useCreateUserApi;
