import React, { useReducer, useEffect } from "react";
import { LoginCreds } from "../types/user.types";
import { doLogin, doLogout } from "../api/loginService";
import { UserContext, initialState, userReducer } from "./UserSession";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          if (userData.id) {
            dispatch({
              type: "LOGIN_OK",
              payload: { user: userData, token },
            });
          }
        } catch (err) {
          console.error("Loading user data from localStorage is failed", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    loadUserData();
  }, []);

  const login = async (creds: LoginCreds) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { user, token } = await doLogin(creds);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_OK", payload: { user, token } });
    } catch (error) {
      dispatch({
        type: "LOGIN_ERR",
        payload: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  };

  const logout = () => {
    doLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <UserContext.Provider value={{ state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
