// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthPage from "./apps/AuthPage";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  return (
    <>
      <BrowserRouter>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<>로딩중</>}>
              <AuthPage />
            </Suspense>
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>
    </>
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
