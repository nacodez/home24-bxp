import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../AuthContext";
import { AuthProvider } from "../AuthContextProvider";
import * as authApi from "../../api/authApi";

// Mock the auth API
jest.mock("../api/authApi", () => ({
  login: jest.fn(),
  logout: jest.fn().mockResolvedValue(undefined),
}));

const mockLoginFn = authApi.login as jest.MockedFunction<typeof authApi.login>;
const mockLogoutFn = authApi.logout as jest.MockedFunction<
  typeof authApi.logout
>;

const TestComponent = () => {
  const { state, login, logout } = React.useContext(AuthContext);
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
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
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
    mockLoginFn.mockResolvedValue({ user: mockUser, token: "test-token" });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      userEvent.click(screen.getByText("Login"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Authenticated"
      );
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "test@example.com"
      );
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockUser)
    );
  });

  test("updates state after logout", async () => {
    // Mock initial authenticated state
    localStorage.setItem("token", "test-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "123",
        email: "test@example.com",
        name: "Test User",
      })
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should start authenticated due to localStorage values
    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Authenticated"
      );
    });

    // Reset the mock to ensure we can verify it's called
    mockLogoutFn.mockClear();

    await act(async () => {
      userEvent.click(screen.getByText("Logout"));
    });

    // Verify the logout API was called
    expect(mockLogoutFn).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Not Authenticated"
      );
      expect(screen.getByTestId("user-email")).toHaveTextContent("No user");
    });

    // Verify localStorage items were removed
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  test("handles login failure", async () => {
    mockLoginFn.mockRejectedValue(new Error("Invalid credentials"));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      userEvent.click(screen.getByText("Login"));
    });

    // State should remain unauthenticated
    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent(
        "Not Authenticated"
      );
      expect(screen.getByTestId("user-email")).toHaveTextContent("No user");
    });
  });
});
