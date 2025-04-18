import React from "react";
import MainLayout from "../components/Layout/AppLayout";
import ProductList from "../components/Products/ItemList";

const ProductListPage: React.FC = () => {
  return (
    <MainLayout>
      <ProductList />
    </MainLayout>
  );
};

export default ProductListPage;
