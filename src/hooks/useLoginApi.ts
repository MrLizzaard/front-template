import { useMutation } from "@tanstack/react-query";
import {
  loginApi,
  type LoginApiError,
  type LoginParams,
  type LoginResponse,
} from "../apis/authApi";

const useLoginApi = () =>
  useMutation<LoginResponse, LoginApiError, LoginParams>({
    mutationFn: loginApi,
  });

export default useLoginApi;
