import { useMutation } from "@tanstack/react-query";
import { deleteUserApi } from "../apis/userApi";

const useDeleteUserApi = () =>
  useMutation<number, unknown, number>({
    mutationFn: deleteUserApi,
  });

export default useDeleteUserApi;
