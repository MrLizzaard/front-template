import { useQuery } from "@tanstack/react-query";
import { request } from "../utils/api";

const useWeatherApi = () => {
  return useQuery({
    queryKey: ["testQuery"],
    queryFn: () => request<string>({ url: "api/weather", method: "GET" }),
  });
};

export default useWeatherApi;
