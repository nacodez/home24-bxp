import React from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  ShoppingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { Category } from "../../types/category.types";

const { Sider } = Layout;
const { SubMenu } = Menu;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { categoryTree, isLoading } = useCategories();

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith("/products")) {
      return ["products"];
    }
    if (path.startsWith("/categories")) {
      return ["categories"];
    }
    return ["dashboard"];
  };

  const renderCategoryMenu = (
    categories: (Category & { children: Category[] })[]
  ) => {
    return categories.map((category) => {
      if (category.children && category.children.length > 0) {
        return (
          <SubMenu
            key={`category-${category.id}`}
            title={category.name}
            icon={<AppstoreOutlined />}
          >
            <Menu.Item key={`category-${category.id}-products`}>
              <Link to={`/products?categoryId=${category.id}`}>Products</Link>
            </Menu.Item>
            {renderCategoryMenu(
              category.children as (Category & { children: Category[] })[]
            )}
          </SubMenu>
        );
      }

      return (
        <Menu.Item key={`category-${category.id}`} icon={<AppstoreOutlined />}>
          <Link to={`/products?categoryId=${category.id}`}>
            {category.name}
          </Link>
        </Menu.Item>
      );
    });
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.2)",
          margin: 16,
          borderRadius: 4,
        }}
      >
        <h1
          style={{
            color: "#fff",
            margin: 0,
            fontSize: collapsed ? 16 : 24,
          }}
        >
          {collapsed ? "H24" : "Home24 BXP"}
        </h1>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={["categories"]}
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="products" icon={<ShoppingOutlined />}>
          <Link to="/products">All Products</Link>
        </Menu.Item>

        <SubMenu
          key="categories"
          icon={<AppstoreOutlined />}
          title="Categories"
        >
          {!isLoading &&
            renderCategoryMenu(
              categoryTree as (Category & { children: Category[] })[]
            )}
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
