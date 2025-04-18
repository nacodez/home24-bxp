import React from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  ShoppingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { Category } from "../../types/category.types";
import type { MenuProps } from "antd";

const { Sider } = Layout;

type MenuItemType = Required<MenuProps>["items"][number];

interface NavMenuProps {
  collapsed: boolean;
}

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

const NavMenu: React.FC<NavMenuProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { catTree, loading } = useCategories();

  const handleMenuClick: MenuProps["onClick"] = (info) => {
    const { key } = info;

    if (key === "dashboard") {
      navigate("/", { replace: true });
    } else if (key === "products") {
      navigate("/products", { replace: true });
    } else if (key.startsWith("cat-")) {
      const matches = key.match(/cat-(\d+)(?:-all)?/);
      if (matches && matches[1]) {
        const catId = matches[1];
        navigate(`/products?categoryId=${catId}`, { replace: true });
      }
    }
  };

  const getSelectedKeys = (): string[] => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("categoryId");

    if (location.pathname === "/") {
      return ["dashboard"];
    }

    if (location.pathname.startsWith("/products")) {
      if (categoryId) {
        return [`cat-${categoryId}`];
      }
      return ["products"];
    }

    return ["dashboard"];
  };

  const buildCategoryItems = (): MenuItemType[] => {
    if (loading || !catTree || catTree.length === 0) {
      return [];
    }

    const buildItems = (categories: CategoryWithChildren[]): MenuItemType[] => {
      return categories.map((cat) => {
        const catId = typeof cat.id === "string" ? cat.id : cat.id.toString();
        const key = `cat-${catId}`;
        const hasChildren = cat.children && cat.children.length > 0;

        if (hasChildren) {
          return {
            key,
            label: cat.name,
            icon: <AppstoreOutlined />,
            children: [
              {
                key: `cat-${catId}-all`,
                label: `All ${cat.name}`,
                onClick: () => {
                  navigate(`/products?categoryId=${catId}`, { replace: true });
                  return false;
                },
              },

              ...buildItems(cat.children),
            ],
          };
        }
        return {
          key,
          label: cat.name,
          icon: <AppstoreOutlined />,
        };
      });
    };

    return buildItems(catTree as CategoryWithChildren[]);
  };

  const menuItems: MenuItemType[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      key: "products",
      label: "All Products",
      icon: <ShoppingOutlined />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: <AppstoreOutlined />,
      children: buildCategoryItems(),
    },
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
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default NavMenu;
