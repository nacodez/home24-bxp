import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, List, Spin } from "antd";
import { ShoppingOutlined, AppstoreOutlined } from "@ant-design/icons";
import MainLayout from "../components/Layout/MainLayout";
import { useCategories } from "../hooks/useCategories";
import { Link } from "react-router-dom";
import { get } from "../api/apiClient";
import { Product } from "../types/product.types";

const { Title } = Typography;

interface CategoryStat {
  id: number;
  name: string;
  count: number;
}

const DashboardPage: React.FC = () => {
  const { categories } = useCategories();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryStat[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const products = await get<Product[]>("/products");
        setAllProducts(products);

        const categoryCounts = new Map<number, number>();

        products.forEach((product) => {
          if (product && product.category_id !== undefined) {
            const categoryId =
              typeof product.category_id === "string"
                ? parseInt(product.category_id)
                : product.category_id;

            const currentCount = categoryCounts.get(categoryId) || 0;
            categoryCounts.set(categoryId, currentCount + 1);
          }
        });

        const categoryStats = categories.map((category) => {
          const categoryId =
            typeof category.id === "string"
              ? parseInt(category.id)
              : category.id;

          return {
            id: categoryId,
            name: category.name,
            count: categoryCounts.get(categoryId) || 0,
          };
        });

        setTopCategories(
          categoryStats.sort((a, b) => b.count - a.count).slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch products for dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchAllProducts();
    }
  }, [categories]);

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Title level={2}>Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Products"
              value={allProducts.length}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Categories"
              value={categories.length}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Top Categories">
        <List
          dataSource={topCategories}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Link key="view-action" to={`/products?categoryId=${item.id}`}>
                  View Products
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`${item.count} products`}
              />
            </List.Item>
          )}
        />
      </Card>
    </MainLayout>
  );
};

export default DashboardPage;
