import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, List, Spin } from "antd";
import { ShoppingOutlined, AppstoreOutlined } from "@ant-design/icons";
import AppLayout from "../components/Layout/AppLayout";
import { useCategories } from "../hooks/useCategories";
import { Link } from "react-router-dom";
import { getStuff } from "../api/httpService";
import { Item } from "../types/item.types";

const { Title } = Typography;

interface CatStat {
  id: number;
  name: string;
  count: number;
}

const HomePage: React.FC = () => {
  const { cats } = useCategories();
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [topCats, setTopCats] = useState<CatStat[]>([]);

  useEffect(() => {
    const getAllItems = async () => {
      try {
        setLoading(true);
        const products = await getStuff<Item[]>("/products");
        setAllItems(products);

        const catCounts = new Map<number, number>();

        products.forEach((prod) => {
          if (prod && prod.category_id !== undefined) {
            const catId =
              typeof prod.category_id === "string"
                ? parseInt(prod.category_id)
                : prod.category_id;

            const curCount = catCounts.get(catId) || 0;
            catCounts.set(catId, curCount + 1);
          }
        });

        const stats = cats.map((cat) => {
          const catId = typeof cat.id === "string" ? parseInt(cat.id) : cat.id;

          return {
            id: catId,
            name: cat.name,
            count: catCounts.get(catId) || 0,
          };
        });

        setTopCats(stats.sort((a, b) => b.count - a.count).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch products for dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (cats.length > 0) {
      getAllItems();
    }
  }, [cats]);

  if (loading) {
    return (
      <AppLayout>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Title level={2}>Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Products"
              value={allItems.length}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Categories"
              value={cats.length}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Top Categories">
        <List
          dataSource={topCats}
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
    </AppLayout>
  );
};

export default HomePage;
