import React, { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import TopBar from "./TopBar";
import NavMenu from "./NavMenu";
import { RecentItem } from "../Products/RecentItem";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView && !collapsed) {
        setCollapsed(true);
      }
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [collapsed]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div
        className={`sidebar-container ${isMobile ? "mobile" : ""} ${
          collapsed && isMobile ? "hidden" : ""
        }`}
      >
        <NavMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <Layout
        className={`site-layout ${collapsed ? "collapsed" : ""} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <TopBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: isMobile ? "8px" : "16px" }}>
          <RecentItem />
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

        {/* Mobile toggle button */}
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

export default AppLayout;
