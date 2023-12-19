import React, { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const About = lazy(() => import("../pages/About"));
const Weather = lazy(() => import("../pages/Weather"));

const AppRouter = () => {
  let element = useRoutes([
    {
      path: "/main",
      element: <Navigate to="/" />,
    },
    {
      path: "/about",
      element: <About />,
    },

    {
      path: "/",
      element: <Weather />,
    },
    {
      path: "*",
      element: <div>없는 페이지</div>,
    },
  ]);

  return element;
};

export default AppRouter;
