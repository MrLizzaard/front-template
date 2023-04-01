import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Layout from "./Layout/Layout";

interface LoginProps {
  setIsAuthorized: any;
}

const Router = ({ setIsAuthorized }: LoginProps) => {
  return (
    <>
      {/* 로그인 여부에따른 페이지 라우팅 */}

      <Layout setIsAuthorized={setIsAuthorized}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </>
  );
};

export default Router;
