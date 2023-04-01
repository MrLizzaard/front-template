import React from "react";
import { LayoutProps } from "../../../types/reactType";
import { MainpageWrapper } from "./style";

const Mainpage = ({ children }: LayoutProps) => {
  return <MainpageWrapper>{children}</MainpageWrapper>;
};

export default Mainpage;
