import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { LoginCredentials } from "../../types/auth.types";
import { isFirebaseAvailable } from "../../firebase/config";

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const { login, state } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginCredentials) => {
    try {
      await login(values);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const fillDemoCredentials = () => {
    form.setFieldsValue({
      email: "demo@home24.de",
      password: "password",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "16px",
      }}
    >
      <Card
        className="login-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Home24 BXP Admin
        </Title>

        {state.error && (
          <Alert
            message="Login Failed"
            description={state.error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {!isFirebaseAvailable && (
          <Alert
            message="Default Firebase Not Configured"
            description="If Firebase authentication is not configured, Please use the demo credentials to log in."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div
          className="demo-info"
          style={{
            background: "#f9f9f9",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #e8e8e8",
          }}
        >
          <Text strong>Demo credentials:</Text>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <Text>Email: demo@home24.de</Text>
            <Text>Password: password</Text>
          </div>
          <Button
            type="link"
            onClick={fillDemoCredentials}
            style={{ padding: 0, height: "auto", marginTop: "4px" }}
          >
            Auto-fill demo credentials
          </Button>
        </div>

        <Form
          form={form}
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={state.isLoading}
              style={{ width: "100%" }}
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
