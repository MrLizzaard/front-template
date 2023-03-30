import React from "react";
import dayjs from "dayjs";

const Route = () => {
  const test = dayjs(new Date()).format();
  return <div>{test}</div>;
};

export default Route;
