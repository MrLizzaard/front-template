import useWeatherApi from "../../hooks/useWeatherApi";

const Weather = () => {
  const { data, isLoading } = useWeatherApi();

  if (isLoading) {
    return <div>페이지</div>;
  } else {
    return <div>{data}</div>;
  }
};

export default Weather;
