import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import ProductDetails from "../components/Products/Details/ProductDetails";
import AttributeEditor from "../components/Products/Attributes/AttributeEditor";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/product.types";
import { Tabs, Spin, Alert } from "antd";
import { AttributeValue } from "../types/product.types";

interface ProductDetailsPageProps {
  editMode?: boolean;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  editMode = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const { updateProductAttributes, getProductById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          const productData = await getProductById(parseInt(id));
          setProduct(productData);
        } catch {
          setError("Failed to load product. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  const handleSaveAttributes = async (attributes: AttributeValue[]) => {
    if (id && product) {
      try {
        await updateProductAttributes(parseInt(id), { ...product, attributes });
        const updatedProduct = await getProductById(parseInt(id));
        setProduct(updatedProduct);
      } catch (error) {
        console.error("Failed to save attributes", error);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert message="Error" description={error} type="error" showIcon />
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <Alert
          message="Product Not Found"
          description="The requested product could not be found."
          type="warning"
          showIcon
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {editMode ? (
        <Tabs defaultActiveKey="attributes">
          <Tabs.TabPane tab="Product Information" key="info">
            <ProductDetails editMode={true} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Edit Attributes" key="attributes">
            <AttributeEditor
              productId={parseInt(id as string)}
              attributes={product.attributes}
              onSave={handleSaveAttributes}
            />
          </Tabs.TabPane>
        </Tabs>
      ) : (
        <ProductDetails />
      )}
    </MainLayout>
  );
};

export default ProductDetailsPage;
