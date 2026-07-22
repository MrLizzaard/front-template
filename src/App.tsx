import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { ConfigProvider } from "antd";
import AuthPage from "./apps/AuthPage";
import LoadingFallback from "./components/LoadingFallback";
import theme from "./theme";

function App() {
  // 화면 전환은 메뉴/탭 상태로만 이뤄지고 URL은 쓰지 않으므로,
  // 주소창에 임의 경로를 입력해 들어온 경우에도 항상 루트로 되돌린다.
  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingFallback fullscreen />}>
            <AuthPage />
          </Suspense>
        </QueryClientProvider>
      </JotaiProvider>
    </ConfigProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {},
  },
});

export default App;
