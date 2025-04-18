import React from "react";
import { Layout, Button, Typography, Space, Dropdown, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useUser } from "../../hooks/useUser";
import type { MenuProps } from "antd";

const { Header } = Layout;
const { Text } = Typography;

interface TopBarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ collapsed, setCollapsed }) => {
  const { state, logout } = useUser();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <Header
      style={{
        padding: "0 16px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{ fontSize: "16px", width: 64, height: 64 }}
      />

      <Space>
        {state.user && (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <Text strong>{state.user.name}</Text>
            </Space>
          </Dropdown>
        )}
      </Space>
    </Header>
  );
};

export default TopBar;
