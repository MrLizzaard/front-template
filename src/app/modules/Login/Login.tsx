import React from "react";

interface LoginProps {
  setIsAuthorized: any;
}

const Login = ({ setIsAuthorized }: LoginProps) => {
  return (
    <div>
      로그인페이지
      <button
        type="button"
        onClick={() => {
          setIsAuthorized(true);
        }}
      >
        로그인
      </button>
    </div>
  );
};

export default Login;
