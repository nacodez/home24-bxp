import React from "react";
import { Card, Typography, Tag, Space, Button } from "antd";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useRecentItem } from "../../hooks/useRecentItem";
import { useCategories } from "../../hooks/useCategories";

const { Text, Title } = Typography;

export const RecentItem: React.FC = () => {
  const { recentItem } = useRecentItem();
  const { cats } = useCategories();

  if (!recentItem) {
    return null;
  }

  const getCatName = (catId: number) => {
    const cat = cats.find((c) => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
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
          <Text strong>{recentItem.name}</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Tag color="blue">{getCatName(recentItem.category_id)}</Tag>
              {recentItem.last_modified && (
                <Text type="secondary">
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {formatDate(recentItem.last_modified)}
                </Text>
              )}
            </Space>
          </div>
        </div>
        <Link to={`/products/${recentItem.id}`}>
          <Button type="primary" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      </div>
    </Card>
  );
};
