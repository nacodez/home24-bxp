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
import type { MenuProps } from "antd";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

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

  const buildCategoryMenuItems = (
    categories: (Category & { children: Category[] })[]
  ): MenuItem[] => {
    return categories.map((category) => {
      if (category.children && category.children.length > 0) {
        const childItems: MenuItem[] = [
          getItem(
            <Link to={`/products?categoryId=${category.id}`}>
              All {category.name} Products
            </Link>,
            `category-${category.id}-products`
          ),
          ...buildCategoryMenuItems(
            category.children as (Category & { children: Category[] })[]
          ),
        ];

        return getItem(
          category.name,
          `category-${category.id}`,
          <AppstoreOutlined />,
          childItems
        );
      }

      return getItem(
        <Link to={`/products?categoryId=${category.id}`}>{category.name}</Link>,
        `category-${category.id}`,
        <AppstoreOutlined />
      );
    });
  };

  const items: MenuItem[] = [
    getItem(<Link to="/">Dashboard</Link>, "dashboard", <DashboardOutlined />),
    getItem(
      <Link to="/products">All Products</Link>,
      "products",
      <ShoppingOutlined />
    ),
    getItem(
      "Categories",
      "categories",
      <AppstoreOutlined />,
      !isLoading
        ? buildCategoryMenuItems(
            categoryTree as (Category & { children: Category[] })[]
          )
        : []
    ),
  ];

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
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
