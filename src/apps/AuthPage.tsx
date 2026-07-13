import AppRouter from "../router/AppRouter";
import { useState } from "react";

const AuthPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  if (isLoggedIn) {
    return <AppRouter />;
  } else {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setIsLoggedIn(true);
          }}
        >
          로그인
        </button>
      </>
    );
  }
};

export default AuthPage;
