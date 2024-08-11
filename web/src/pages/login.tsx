import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const { Title } = Typography;

const LoginForm: React.FC = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values: any) => {
    console.log('Received values:', values);
    const result = await signIn('credentials', {
        email: email,
        password: password,
        // callbackUrl: '/',
        redirect: false,
    });
    if (result?.error) {
        setEmail("");
        setPassword("");
        message.error("Invalid Login Parameters");
    } else if (result?.ok) {
        message.success("Login Successful");
        router.push('/')
    }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Login</Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            initialValue={email}
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input 
                placeholder="Enter your email" 
                onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            initialValue={password}
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password 
                placeholder="Enter your password" 
                onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
