import React, { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LastModifiedProduct } from "../Products/LastModifiedProduct";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and when resizing
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [collapsed]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div
        className={`sidebar-container ${isMobile ? "mobile" : ""} ${
          collapsed && isMobile ? "hidden" : ""
        }`}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      <Layout
        className={`site-layout ${collapsed ? "collapsed" : ""} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: isMobile ? "8px" : "16px" }}>
          <LastModifiedProduct />
          <div
            style={{
              padding: isMobile ? 16 : 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 4,
              overflowX: "auto",
            }}
          >
            {children}
          </div>
        </Content>

        {/* Mobile toggle button - only shown on mobile */}
        {isMobile && (
          <Button
            type="primary"
            className="sidebar-toggle-button"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          />
        )}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
