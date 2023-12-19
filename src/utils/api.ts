import { AxiosError, AxiosRequestConfig } from "./../../node_modules/axios/index.d";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const { data } = await api.request<T>({ ...config });
    return data;
  } catch (error) {
    const { response }: any = error as unknown as AxiosError;
    if (response) {
      throw response.data;
    }

    throw error;
  }
};
