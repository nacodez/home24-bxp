import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import ProductList from "../components/Products/ProductList";

const ProductListPage: React.FC = () => {
  return (
    <MainLayout>
      <ProductList />
    </MainLayout>
  );
};

export default ProductListPage;
