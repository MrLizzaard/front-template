import { useMemo, useState } from "react";
import type { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { Avatar, Dropdown, Layout, Menu, Space, Tabs } from "antd";
import type { MenuProps, TabsProps } from "antd";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TabContent from "./TabContent";
import { getToken } from "../../utils/token";
import { decodeMockToken } from "../../utils/jwt";
import { findMenuLabel, findOpenKeys, getDefaultPath, getMenuItems } from "../../utils/menuTree";
import "./MainLayout.css";

interface TabItem {
  key: string;
  label: string;
}

type DraggableTabNodeProps = HTMLAttributes<HTMLDivElement> & {
  "data-node-key": string;
};

const DraggableTabNode = ({ className, ...props }: DraggableTabNodeProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props["data-node-key"] });

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    zIndex: isDragging ? 10 : undefined,
  };

  return <div {...props} {...attributes} {...listeners} ref={setNodeRef} style={style} className={className} />;
};

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout = ({ onLogout }: MainLayoutProps) => {
  const { userName, auth } = useMemo(() => {
    const token = getToken();
    const payload = token ? decodeMockToken(token) : null;
    return { userName: payload?.userName ?? "사용자", auth: payload?.auth ?? null };
  }, []);

  // 주소창 URL이 아니라 이 값이 곧 "현재 화면"이다. 메뉴/탭 클릭으로만 바뀌므로
  // 주소창에 임의의 경로를 입력해도 접근할 수 없는 화면으로 이동할 방법이 없다.
  const defaultPath = useMemo(() => getDefaultPath(auth), [auth]);
  const menuItems = useMemo(() => getMenuItems(auth), [auth]);

  const [collapsed, setCollapsed] = useState(false);
  const [tabs, setTabs] = useState<TabItem[]>(() => [
    { key: defaultPath, label: findMenuLabel(defaultPath) ?? defaultPath },
  ]);
  const [activePath, setActivePath] = useState(defaultPath);

  const openPath = (path: string) => {
    setActivePath(path);
    setTabs((prev) => {
      if (prev.some((tab) => tab.key === path)) return prev;
      return [...prev, { key: path, label: findMenuLabel(path) ?? path }];
    });
  };

  const handleTabChange = (key: string) => {
    setActivePath(key);
  };

  const handleTabEdit: TabsProps["onEdit"] = (targetKey, action) => {
    if (action !== "remove") return;

    setTabs((prev) => {
      const removedIndex = prev.findIndex((tab) => tab.key === targetKey);
      if (removedIndex === -1) return prev;

      const next = prev.filter((tab) => tab.key !== targetKey);

      if (activePath === targetKey) {
        const fallback = next[removedIndex - 1] ?? next[removedIndex] ?? next[0];
        setActivePath(fallback ? fallback.key : defaultPath);
      }

      return next;
    });
  };

  const dragSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 4 },
  });
  const dragSensors = useSensors(dragSensor);

  const handleTabDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setTabs((prev) => {
      const activeIndex = prev.findIndex((tab) => tab.key === active.id);
      const overIndex = prev.findIndex((tab) => tab.key === over.id);
      if (activeIndex === -1 || overIndex === -1) return prev;
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "로그아웃",
      onClick: onLogout,
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={180} collapsedWidth={56}>
        <div className="main-layout-logo">{collapsed ? "F" : "Front"}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activePath]}
          defaultOpenKeys={findOpenKeys(activePath)}
          items={menuItems}
          onClick={({ key }) => {
            if (key.startsWith("/")) openPath(key);
          }}
        />
      </Sider>
      <Layout>
        <Header className="main-layout-header" style={{ height: 44, lineHeight: "44px", padding: "0 8px" }}>
          <Space className="main-layout-toggle" onClick={() => setCollapsed((prev) => !prev)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Space>
          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
            <Space className="main-layout-user">
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{userName}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content className="main-layout-content">
          <Tabs
            className="main-layout-tabs"
            type="editable-card"
            hideAdd
            size="small"
            activeKey={activePath}
            items={tabs.map((tab) => ({
              key: tab.key,
              label: tab.label,
              closable: tabs.length > 1,
            }))}
            onChange={handleTabChange}
            onEdit={handleTabEdit}
            renderTabBar={(tabBarProps, DefaultTabBar) => (
              <DndContext sensors={dragSensors} onDragEnd={handleTabDragEnd}>
                <SortableContext items={tabs.map((tab) => tab.key)} strategy={horizontalListSortingStrategy}>
                  <DefaultTabBar {...tabBarProps}>
                    {(node) => (
                      <DraggableTabNode {...(node as ReactElement<DraggableTabNodeProps>).props} key={node.key}>
                        {node}
                      </DraggableTabNode>
                    )}
                  </DefaultTabBar>
                </SortableContext>
              </DndContext>
            )}
          />
          <TabContent paths={tabs.map((tab) => tab.key)} activePath={activePath} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
