import { lazy } from "react";
import type { ComponentType, ReactElement } from "react";

const pageModules = import.meta.glob<{ default: ComponentType }>(
  "../pages/**/*.tsx"
);

const toRoutePath = (filePath: string): string => {
  const path = filePath
    .replace("../pages", "")
    .replace(/\/index\.tsx$/, "")
    .replace(/\.tsx$/, "")
    .toLowerCase();

  return path || "/";
};

// 엘리먼트를 렌더링 중이 아니라 모듈 로드 시점에 한 번만 생성해 캐싱한다.
// 그래야 탭을 오갈 때마다 매번 같은 엘리먼트 참조를 재사용해
// (렌더 도중 컴포넌트를 새로 만드는 것으로 오인되지 않고) 상태가 유지된다.
const pageElementMap = new Map<string, ReactElement>(
  Object.entries(pageModules).map(([filePath, loadModule]) => {
    const Component = lazy(loadModule);
    return [toRoutePath(filePath), <Component />];
  })
);

// 옛 경로 별칭
const pathAliases: Record<string, string> = {
  "/main": "/",
};

export const resolvePageElement = (
  pathname: string
): ReactElement | undefined => {
  const normalized = pathname.toLowerCase();
  return pageElementMap.get(pathAliases[normalized] ?? normalized);
};
