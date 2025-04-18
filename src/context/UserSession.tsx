import { createContext } from "react";
import { UserState, User, LoginCreds } from "../types/user.types";

export const initialState: UserState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

export type UserAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_OK"; payload: { user: User; token: string } }
  | { type: "LOGIN_ERR"; payload: string }
  | { type: "LOGOUT" };

export type UserContextType = {
  state: UserState;
  login: (creds: LoginCreds) => Promise<void>;
  logout: () => void;
};

export const userReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_OK":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_ERR":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const UserContext = createContext<UserContextType>({
  state: initialState,
  login: async () => {},
  logout: () => {},
});
