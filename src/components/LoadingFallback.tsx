import { Spin } from "antd";

interface LoadingFallbackProps {
  fullscreen?: boolean;
}

const LoadingFallback = ({ fullscreen = false }: LoadingFallbackProps) =>
  fullscreen ? (
    <Spin size="large" fullscreen tip="로딩중..." />
  ) : (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
      <Spin size="large" />
    </div>
  );

export default LoadingFallback;
