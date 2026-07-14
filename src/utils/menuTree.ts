import type { MenuProps } from "antd";
import menuData from "../data/menu.json";

export interface MenuRecord {
  MENU_ID: number;
  PARENT_MENU_ID: number | null;
  MENU_NAME: string;
  MENU_DESC: string;
  MENU_DEPTH: number;
  PROGRAM_PATH: string | null;
  SORT_NO: number;
  USE_FLAG: "Y" | "N";
  MENU_AUTH?: "Admin" | "User";
}

type MenuItem = NonNullable<MenuProps["items"]>[number];

const records = (menuData as MenuRecord[]).filter(
  (menu) => menu.USE_FLAG === "Y"
);

// Admin은 모든 메뉴를 본다. 그 외에는 MENU_AUTH가 없거나 자신의 권한과 일치할 때만 보인다.
// 상위 메뉴가 걸러지면 buildTree가 그 하위로 재귀하지 않으므로 하위 메뉴도 함께 가려진다.
const isVisibleForAuth = (menu: MenuRecord, auth: string | null): boolean =>
  auth === "Admin" || !menu.MENU_AUTH || menu.MENU_AUTH === auth;

const buildTree = (parentId: number | null, auth: string | null): MenuItem[] =>
  records
    .filter((menu) => menu.PARENT_MENU_ID === parentId && isVisibleForAuth(menu, auth))
    .sort((a, b) => a.SORT_NO - b.SORT_NO)
    .map((menu) => {
      const children = buildTree(menu.MENU_ID, auth);

      if (children.length > 0) {
        return { key: String(menu.MENU_ID), label: menu.MENU_NAME, children };
      }

      if (menu.PROGRAM_PATH) {
        return { key: menu.PROGRAM_PATH, label: menu.MENU_NAME };
      }

      // 이동할 경로도, 활성화된 하위 메뉴도 없는 폴더 노드 (예: 하위 메뉴가 전부 USE_FLAG=N)
      return { key: String(menu.MENU_ID), label: menu.MENU_NAME, disabled: true };
    });

export const getMenuItems = (auth: string | null): MenuProps["items"] =>
  buildTree(null, auth);

// 권한에 맞는 메뉴 트리에서 가장 먼저 눌리는 리프 메뉴의 경로를 찾는다.
// 로그인 직후 기본으로 열어줄 탭을 정하는 데 쓴다.
const findFirstLeafPath = (parentId: number | null, auth: string | null): string | null => {
  const children = records
    .filter((menu) => menu.PARENT_MENU_ID === parentId && isVisibleForAuth(menu, auth))
    .sort((a, b) => a.SORT_NO - b.SORT_NO);

  for (const menu of children) {
    if (menu.PROGRAM_PATH) return menu.PROGRAM_PATH;

    const leafPath = findFirstLeafPath(menu.MENU_ID, auth);
    if (leafPath) return leafPath;
  }

  return null;
};

export const getDefaultPath = (auth: string | null): string =>
  findFirstLeafPath(null, auth) ?? "/";

export const findMenuLabel = (pathname: string): string | undefined =>
  records.find((menu) => menu.PROGRAM_PATH === pathname)?.MENU_NAME;

export const findOpenKeys = (pathname: string): string[] => {
  const current = records.find((menu) => menu.PROGRAM_PATH === pathname);
  if (!current) return [];

  const openKeys: string[] = [];
  let parentId = current.PARENT_MENU_ID;

  while (parentId !== null) {
    const parent = records.find((menu) => menu.MENU_ID === parentId);
    if (!parent) break;

    openKeys.push(String(parent.MENU_ID));
    parentId = parent.PARENT_MENU_ID;
  }

  return openKeys;
};
