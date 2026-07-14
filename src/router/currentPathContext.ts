import { createContext, useContext } from "react";

// 라우터 URL 대신 탭 상태로 화면을 전환하므로, 각 페이지가 "나는 어떤 탭인지"
// 알아야 할 때(예: 탭 제목 조회) useLocation 대신 이 컨텍스트를 사용한다.
export const CurrentPathContext = createContext<string>("");

export const useCurrentPath = (): string => useContext(CurrentPathContext);
