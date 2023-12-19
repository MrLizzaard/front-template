import React, { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const About = lazy(() => import("../pages/About"));

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
      element: <div>대시보드</div>,
    },
    {
      path: "*",
      element: <div>없는 페이지</div>,
    },
  ]);

  return element;
};

export default AppRouter;
