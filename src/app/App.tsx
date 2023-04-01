import React, { useState } from "react";
import Router from "./Router";
import Login from "./modules/Login/Login";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  // auth시 isAut

  return <div>{isAuthorized ? <Router /> : <Login setIsAuthorized={setIsAuthorized} />}</div>;
}

export default App;
