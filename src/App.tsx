import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import AuthPage from "./apps/AuthPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <JotaiProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<>로딩중</>}>
              <AuthPage />
            </Suspense>
          </QueryClientProvider>
        </JotaiProvider>
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
