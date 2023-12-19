import { useQuery } from "react-query";
import { request } from "../utils/api";

const useWeatherApi = () => {
  return useQuery("testQuery", () => request<string>({ url: "api/weather", method: "GET" }));
};

export default useWeatherApi;
