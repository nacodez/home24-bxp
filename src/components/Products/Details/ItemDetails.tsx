import React from "react";
import { Descriptions, Divider, Typography, Card, Button } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCategories } from "../../../hooks/useCategories";
import ProdProps from "../Attributes/ItemProperties";
import { Item } from "../../../types/item.types";

const { Title } = Typography;

interface ItemDetailsProps {
  item?: Item;
  editMode?: boolean;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({
  item,
  editMode = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { cats } = useCategories();

  if (!item) {
    return null;
  }

  const getCatName = (catId: number) => {
    const cat = cats.find((c) => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => nav(-1)}>
          Back
        </Button>
      </div>

      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={3}>{item.name}</Title>
            {!editMode && (
              <Link to={`/products/${id}/edit`}>
                <Button type="primary" icon={<EditOutlined />}>
                  Edit
                </Button>
              </Link>
            )}
          </div>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{item.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{item.name}</Descriptions.Item>
          <Descriptions.Item label="Category">
            {getCatName(item.category_id)}
          </Descriptions.Item>
          <Descriptions.Item label="Last Modified">
            {item.last_modified
              ? new Date(item.last_modified).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Item Attributes</Divider>
        <ProdProps attributes={item.attributes} readOnly />
      </Card>
    </div>
  );
};

export default ItemDetails;
