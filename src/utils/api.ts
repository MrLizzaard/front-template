import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
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
