import React from "react";
import { Card, Typography, Tag, Space, Button } from "antd";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLastModifiedProduct } from "../../hooks/useLastModifiedProduct";
import { useCategories } from "../../hooks/useCategories";

const { Text, Title } = Typography;

export const LastModifiedProduct: React.FC = () => {
  const { lastModifiedProduct } = useLastModifiedProduct();
  const { categories } = useCategories();

  if (!lastModifiedProduct) {
    return null;
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card
      style={{
        marginBottom: 16,
        background: "#f9f0ff",
        border: "1px solid #d3adf7",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={5} style={{ marginBottom: 4 }}>
            Last Modified Product
          </Title>
          <Text strong>{lastModifiedProduct.name}</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Tag color="blue">
                {getCategoryName(lastModifiedProduct.category_id)}
              </Tag>
              {lastModifiedProduct.last_modified && (
                <Text type="secondary">
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {formatDate(lastModifiedProduct.last_modified)}
                </Text>
              )}
            </Space>
          </div>
        </div>
        <Link to={`/products/${lastModifiedProduct.id}`}>
          <Button type="primary" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      </div>
    </Card>
  );
};
