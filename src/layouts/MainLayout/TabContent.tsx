import { Suspense, memo } from "react";
import { resolvePageElement } from "../../router/pageRegistry";
import { CurrentPathContext } from "../../router/currentPathContext";

interface TabPaneProps {
  path: string;
  active: boolean;
}

// 탭을 벗어나도 컴포넌트를 언마운트하지 않고 display:none 으로만 숨겨
// 입력하던 폼 값 등 작업 상태가 그대로 유지되게 한다.
// resolvePageElement가 돌려주는 엘리먼트는 모듈 로드 시 미리 만들어진 값이라
// 태그(<Page />)가 아니라 값({element})으로 그대로 끼워 넣는다.
const TabPane = memo(({ path, active }: TabPaneProps) => {
  const element = resolvePageElement(path);

  return (
    <div style={{ display: active ? "block" : "none" }}>
      <CurrentPathContext.Provider value={path}>
        <Suspense fallback={<>로딩중</>}>{element ?? <div>없는 페이지</div>}</Suspense>
      </CurrentPathContext.Provider>
    </div>
  );
});

interface TabContentProps {
  paths: string[];
  activePath: string;
}

const TabContent = ({ paths, activePath }: TabContentProps) => (
  <>
    {paths.map((path) => (
      <TabPane key={path} path={path} active={path === activePath} />
    ))}
  </>
);

export default TabContent;
