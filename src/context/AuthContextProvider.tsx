import React, { useReducer, useEffect } from "react";
import { LoginCredentials } from "../types/auth.types";
import { login as apiLogin, logout as apiLogout } from "../api/authApi";
import { AuthContext, initialState, authReducer } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          if (userData.id) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user: userData, token },
            });
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const { user, token } = await apiLogin(credentials);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
