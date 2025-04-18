import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";

import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import ItemPage from "./pages/ItemPage";

import ItemDetailPage from "./pages/ItemDetailPage";

import AuthGuard from "./components/Auth/AuthGuard";

import { UserProvider } from "./context/SessionProvider";
import RecentItemProvider from "./context/RecentItemProvider";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <UserProvider>
        <RecentItemProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<SignInPage />} />

              <Route
                path="/"
                element={
                  <AuthGuard>
                    <HomePage />
                  </AuthGuard>
                }
              />

              <Route
                path="/products"
                element={
                  <AuthGuard>
                    <ItemPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/products/:id"
                element={
                  <AuthGuard>
                    <ItemDetailPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/products/:id/edit"
                element={
                  <AuthGuard>
                    <ItemDetailPage editMode={true} />
                  </AuthGuard>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </RecentItemProvider>
      </UserProvider>
    </ConfigProvider>
  );
};

export default App;
