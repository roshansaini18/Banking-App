import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, ConfigProvider, Switch } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Homelayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = (checked) => {
    setIsDark(checked);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isDark ? '#001529' : '#ffffff',
            color: isDark ? '#fff' : '#000',
          }}
        >
          <div>
            <Link to={"/admin"} style={{ marginRight: 16, color: isDark ? '#fff' : '#000' }}>
              Visit Admin
            </Link>
            <Link to={"/employee"} style={{ color: isDark ? '#fff' : '#000' }}>
              Visit Employee
            </Link>
          </div>
          <div>
            <span style={{ marginRight: 8 }}>Dark Mode</span>
            <Switch checked={isDark} onChange={toggleTheme} />
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: isDark ? '#141414' : '#f0f2f5',
            borderRadius: '8px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default Homelayout;
