import { useState } from "react";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import MainLayout from "../layouts/MainLayout";
import useLoginApi from "../hooks/useLoginApi";
import { getToken, removeToken, setToken } from "../utils/token";
import { isTokenValid } from "../utils/jwt";
import {
  clearRememberedId,
  getRememberedId,
  setRememberedId,
} from "../utils/rememberedId";
import "./AuthPage.css";

interface LoginFormValues {
  userId: string;
  password: string;
  rememberMe: boolean;
}

const AuthPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    isTokenValid(getToken())
  );
  const { mutate: login, isPending } = useLoginApi();
  const rememberedId = getRememberedId();

  const handleLogin = ({ userId, password, rememberMe }: LoginFormValues) => {
    login(
      { userId, password },
      {
        onSuccess: ({ token }) => {
          if (rememberMe) {
            setRememberedId(userId);
          } else {
            clearRememberedId();
          }

          setToken(token);
          setIsLoggedIn(true);
        },
        onError: (error) => {
          message.error(error.message);
        },
      }
    );
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <MainLayout onLogout={handleLogout} />;
  } else {
    return (
      <div className="auth-page">
        <Card className="auth-card" title="로그인">
          <Form
            layout="vertical"
            onFinish={handleLogin}
            initialValues={{
              userId: rememberedId ?? "",
              rememberMe: !!rememberedId,
            }}
          >
            <Form.Item
              label="아이디"
              name="userId"
              rules={[{ required: true, message: "아이디를 입력하세요" }]}
            >
              <Input placeholder="아이디를 입력하세요" />
            </Form.Item>

            <Form.Item
              label="비밀번호"
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력하세요" }]}
            >
              <Input.Password placeholder="비밀번호를 입력하세요" />
            </Form.Item>

            <Form.Item name="rememberMe" valuePropName="checked" noStyle>
              <Checkbox>아이디 저장</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" block loading={isPending}>
                로그인
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
};

export default AuthPage;
