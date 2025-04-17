import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Divider,
  Spin,
  Typography,
  Card,
  Button,
  message,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import ProductAttributes from "../Attributes/ProductAttributes";
import { Product } from "../../../types/product.types";

const { Title } = Typography;

interface ProductDetailsProps {
  editMode?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  editMode = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { getProductById } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          setLoading(true);
          const productData = await getProductById(parseInt(id));
          setProduct(productData);
        }
      } catch {
        message.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Title level={4}>Product not found</Title>
        <Button type="primary" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
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
            <Title level={3}>{product.name}</Title>
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
          <Descriptions.Item label="ID">{product.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Category">
            {getCategoryName(product.category_id)}
          </Descriptions.Item>
          <Descriptions.Item label="Last Modified">
            {product.last_modified
              ? new Date(product.last_modified).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Product Attributes</Divider>
        <ProductAttributes attributes={product.attributes} readOnly />
      </Card>
    </div>
  );
};

export default ProductDetails;
