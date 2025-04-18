import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";

import LoginPage from "./pages/SignInPage";
import DashboardPage from "./pages/HomePage";
import ProductListPage from "./pages/CatalogPage";
import ProductDetailsPage from "./pages/ItemDetailsPage";

import ProtectedRoute from "./components/Auth/AuthGuard";

import { AuthProvider } from "./context/SessionProvider";
import { LastModifiedProductProvider } from "./context/RecentItemContext";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AuthProvider>
        <LastModifiedProductProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductListPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/products/:id/edit"
                element={
                  <ProtectedRoute>
                    <ProductDetailsPage editMode={true} />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LastModifiedProductProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
