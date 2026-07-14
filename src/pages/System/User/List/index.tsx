import { useEffect, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button, Card, Flex, Form, Input, Popconfirm, Select, Space, Table, Tag, Typography, message } from "antd";
import type { TableColumnsType } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useUserListApi from "../../../../hooks/useUserListApi";
import useCreateUserApi from "../../../../hooks/useCreateUserApi";
import useUpdateUserApi from "../../../../hooks/useUpdateUserApi";
import useDeleteUserApi from "../../../../hooks/useDeleteUserApi";
import type { UserFormValues, UserListItem, UserListParams } from "../../../../apis/userApi";
import { findMenuLabel } from "../../../../utils/menuTree";
import { useCurrentPath } from "../../../../router/currentPathContext";

const { Title } = Typography;

const AUTH_OPTIONS = [
  { label: "관리자", value: "Admin" },
  { label: "일반사용자", value: "User" },
];

// 신규 등록 중인 행을 구분하기 위한 임시 idx (실제 사용자 idx는 1부터 시작하므로 겹치지 않는다)
const NEW_ROW_IDX = -1;

interface EditableCellProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  editing: boolean;
  dataIndex: keyof UserFormValues;
  title: ReactNode;
  children: ReactNode;
}

const EditableCell = ({ editing, dataIndex, title, children, ...restProps }: EditableCellProps) => (
  <td {...restProps}>
    {editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[{ required: true, message: `${title}을(를) 입력하세요` }]}
      >
        {dataIndex === "auth" ? <Select options={AUTH_OPTIONS} /> : <Input />}
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

const UserListPage = () => {
  const currentPath = useCurrentPath();
  const pageTitle = findMenuLabel(currentPath) ?? "사용자목록";

  const [searchForm] = Form.useForm<UserListParams>();
  const [rowForm] = Form.useForm<UserFormValues>();
  const { data, isPending, mutate: search } = useUserListApi();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUserApi();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserApi();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUserApi();

  const [rows, setRows] = useState<UserListItem[]>([]);
  const [syncedData, setSyncedData] = useState<UserListItem[] | undefined>(undefined);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    search({});
  }, [search]);

  // 조회 결과(data)가 바뀌면 편집용 로컬 상태(rows)에 반영한다.
  // effect 대신 렌더링 도중 조정해 불필요한 추가 렌더를 피한다.
  if (data && data !== syncedData) {
    setSyncedData(data);
    setRows(data);
  }

  const handleSearch = (values: UserListParams) => {
    setEditingIdx(null);
    search(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setEditingIdx(null);
    search({});
  };

  const isEditingRow = (record: UserListItem) => record.idx === editingIdx;

  const handleAdd = () => {
    if (editingIdx !== null) return;
    const newRow: UserListItem = { idx: NEW_ROW_IDX, id: "", userName: "", auth: "User" };
    setRows((prev) => [newRow, ...prev]);
    setEditingIdx(NEW_ROW_IDX);
    rowForm.setFieldsValue(newRow);
  };

  const handleEdit = (record: UserListItem) => {
    if (editingIdx !== null) return;
    rowForm.setFieldsValue(record);
    setEditingIdx(record.idx);
  };

  const handleCancel = (record: UserListItem) => {
    if (record.idx === NEW_ROW_IDX) {
      setRows((prev) => prev.filter((row) => row.idx !== NEW_ROW_IDX));
    }
    setEditingIdx(null);
  };

  const handleDelete = async (record: UserListItem) => {
    await deleteUser(record.idx);
    setRows((prev) => prev.filter((row) => row.idx !== record.idx));
    message.success("삭제되었습니다.");
  };

  const handleSave = async (record: UserListItem) => {
    const values = await rowForm.validateFields();

    if (record.idx === NEW_ROW_IDX) {
      const created = await createUser(values);
      setRows((prev) => prev.map((row) => (row.idx === NEW_ROW_IDX ? created : row)));
      message.success("등록되었습니다.");
    } else {
      const updated = await updateUser({ idx: record.idx, ...values });
      setRows((prev) => prev.map((row) => (row.idx === record.idx ? updated : row)));
      message.success("수정되었습니다.");
    }

    setEditingIdx(null);
  };

  const columns: TableColumnsType<UserListItem> = [
    { title: "No.", dataIndex: "idx", width: 60, align: "center", render: (idx: number) => (idx === NEW_ROW_IDX ? "신규" : idx) },
    { title: "아이디", dataIndex: "id", onCell: (record) => ({ record, dataIndex: "id", title: "아이디", editing: isEditingRow(record) }) },
    { title: "이름", dataIndex: "userName", onCell: (record) => ({ record, dataIndex: "userName", title: "이름", editing: isEditingRow(record) }) },
    {
      title: "권한",
      dataIndex: "auth",
      align: "center",
      width: 110,
      onCell: (record) => ({ record, dataIndex: "auth", title: "권한", editing: isEditingRow(record) }),
      render: (auth: string) => (
        <Tag color={auth === "Admin" ? "green" : "default"}>
          {auth === "Admin" ? "관리자" : "일반사용자"}
        </Tag>
      ),
    },
    {
      title: "관리",
      key: "actions",
      width: 130,
      align: "center",
      render: (_, record) =>
        isEditingRow(record) ? (
          <Space>
            <Button size="small" type="link" onClick={() => handleSave(record)} loading={isCreating || isUpdating}>
              저장
            </Button>
            <Button size="small" type="link" onClick={() => handleCancel(record)}>
              취소
            </Button>
          </Space>
        ) : (
          <Space>
            <Button size="small" type="link" disabled={editingIdx !== null} onClick={() => handleEdit(record)}>
              수정
            </Button>
            <Popconfirm title="삭제하시겠습니까?" onConfirm={() => handleDelete(record)} disabled={editingIdx !== null}>
              <Button size="small" type="link" danger disabled={editingIdx !== null} loading={isDeleting}>
                삭제
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (
    <div>
      <Flex gap={12} align="stretch">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={4} style={{ marginTop: 0, marginBottom: 6 }}>
            {pageTitle}
          </Title>
          <Flex justify="flex-end" style={{ marginBottom: 8 }}>
            <Button icon={<PlusOutlined />} onClick={handleAdd} disabled={editingIdx !== null}>
              추가
            </Button>
          </Flex>
          <Form form={rowForm} component={false}>
            <Table<UserListItem>
              rowKey="idx"
              size="small"
              loading={isPending}
              columns={columns}
              dataSource={rows}
              components={{ body: { cell: EditableCell } }}
              pagination={{ pageSize: 10, showTotal: (total) => `총 ${total}건` }}
            />
          </Form>
        </div>
        <Card size="small" title="조회조건" style={{ width: 240, flexShrink: 0 }}>
          <Form form={searchForm} layout="vertical" onFinish={handleSearch}>
            <Form.Item name="id" label="아이디">
              <Input placeholder="아이디를 입력하세요" allowClear />
            </Form.Item>
            <Form.Item name="userName" label="이름">
              <Input placeholder="이름을 입력하세요" allowClear />
            </Form.Item>
            <Form.Item name="auth" label="권한">
              <Select options={AUTH_OPTIONS} placeholder="전체" allowClear />
            </Form.Item>
            <Flex gap={8} justify="flex-end">
              <Button onClick={handleReset}>초기화</Button>
              <Button type="primary" htmlType="submit">
                조회
              </Button>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </div>
  );
};

export default UserListPage;
