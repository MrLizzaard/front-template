import React from "react";
import { LayoutProps } from "../../../types/reactType";
import { NavbarWrapper } from "./style";
import { Link } from "react-router-dom";

const Navbar = ({ setIsAuthorized }: LayoutProps) => {
  return (
    <NavbarWrapper>
      <Link to="/">home</Link>

      <Link to="/about">about</Link>

      <button
        type="button"
        onClick={() => {
          setIsAuthorized(false);
        }}
      >
        로그아웃
      </button>
    </NavbarWrapper>
  );
};

export default Navbar;
