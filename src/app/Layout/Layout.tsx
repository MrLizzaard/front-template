import React from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import { LayoutProps } from "../../types/reactType";
import Mainpage from "./Mainpage/Mainpage";
import SubHeader from "./SubHeader/SubHeader";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <SubHeader />
      <Mainpage>{children}</Mainpage>
    </>
  );
};

export default Layout;
