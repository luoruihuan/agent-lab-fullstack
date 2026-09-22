import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.login(values);
      message.success('登录成功');
      navigate('/');
    } catch (err: any) {
      message.error(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
      <Card title="Agent Lab" style={{ width: 400, boxShadow: 'none' }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
