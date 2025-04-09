import React, { createContext, useState } from "react";
import { Product } from "../types/product.types";

interface LastModifiedProductContextType {
  lastModifiedProduct: Product | null;
  setLastModifiedProduct: (product: Product) => void;
}

export const LastModifiedProductContext =
  createContext<LastModifiedProductContextType>({
    lastModifiedProduct: null,
    setLastModifiedProduct: () => {},
  });

export const LastModifiedProductProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [lastModifiedProduct, setLastModifiedProduct] =
    useState<Product | null>(null);

  return (
    <LastModifiedProductContext.Provider
      value={{ lastModifiedProduct, setLastModifiedProduct }}
    >
      {children}
    </LastModifiedProductContext.Provider>
  );
};
