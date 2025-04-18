import React from "react";
import { Layout, Button, Typography, Space, Dropdown, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const { state, logout } = useAuth();

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <AntHeader
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
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <Text strong>{state.user.name}</Text>
            </Space>
          </Dropdown>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
