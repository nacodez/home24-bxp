import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserContext } from "../UserSession";
import { UserProvider } from "../SessionProvider";
import * as authApi from "../../api/loginService";

jest.mock("../../api/loginService", () => ({
  doLogin: jest.fn(),
  doLogout: jest.fn(),
}));

const mockLoginFn = authApi.doLogin as jest.MockedFunction<
  typeof authApi.doLogin
>;
const mockLogoutFn = authApi.doLogout as jest.MockedFunction<
  typeof authApi.doLogout
>;

const TestComponent = () => {
  const { state, login, logout } = React.useContext(UserContext);
  return (
    <div>
      <div data-testid="auth-state">
        {state.isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </div>
      <div data-testid="user-email">{state.user?.email || "No user"}</div>
      <button
        onClick={() =>
          login({ email: "test@example.com", password: "password" })
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("provides the initial auth state", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId("auth-state")).toHaveTextContent(
      "Not Authenticated"
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("No user");
  });

  test("updates state after successful login", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
    };

    mockLoginFn.mockResolvedValueOnce({ user: mockUser, token: "test-token" });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Authenticated"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "test@example.com"
      );
    });
  });

  test("updates state after logout", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
    };

    mockLoginFn.mockResolvedValueOnce({ user: mockUser, token: "test-token" });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Authenticated"
      );
    });

    const logoutButton = screen.getByText("Logout");
    await act(async () => {
      userEvent.click(logoutButton);
    });

    expect(mockLogoutFn).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Not Authenticated"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("No user");
    });
  });

  test("handles login failure", async () => {
    mockLoginFn.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Not Authenticated"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("No user");
    });
  });
});
