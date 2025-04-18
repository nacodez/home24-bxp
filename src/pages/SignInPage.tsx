import { Navigate } from "react-router-dom";
import LoginForm from "../components/Auth/SignInForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { state } = useAuth();

  if (state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
};

export default LoginPage;
