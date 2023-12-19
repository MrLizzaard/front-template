import useWeatherApi from "../../hooks/useWeatherApi";

const Weather = () => {
  const { data, isLoading } = useWeatherApi();

  if (isLoading) {
    return <div>로딩중</div>;
  } else {
    return <div>{data}</div>;
  }
};

export default Weather;
