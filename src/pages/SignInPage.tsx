import { Navigate } from "react-router-dom";
import SignInForm from "../components/Auth/SignInForm";
import { useUser } from "../hooks/useUser";

const SignInPage: React.FC = () => {
  const { state } = useUser();

  if (state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <SignInForm />;
};

export default SignInPage;
