import React from "react";
import AppLayout from "../components/Layout/AppLayout";
import ItemGrid from "../components/Products/ItemGrid";

const ItemPage: React.FC = () => {
  return (
    <AppLayout>
      <ItemGrid />
    </AppLayout>
  );
};

export default ItemPage;
