import React from "react";
import { LayoutProps } from "../../../types/reactType";
import { NavbarWrapper } from "./style";
import { Link } from "react-router-dom";

const Navbar = ({ children }: LayoutProps) => {
  return (
    <NavbarWrapper>
      <Link to="/">home</Link>

      <Link to="/about">about</Link>
    </NavbarWrapper>
  );
};

export default Navbar;
