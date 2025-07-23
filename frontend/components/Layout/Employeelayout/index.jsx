// import React, { useState } from 'react';
// import {
//     DashboardOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
// } from '@ant-design/icons';
// import { Button, Layout, Menu, theme } from 'antd';
// import { Link,useLocation } from 'react-router-dom';
// const { Header, Sider, Content } = Layout;
// const Adminlayout = ({children}) => {
//   const {pathname}=useLocation();
//     const items=[
//             {
//               key: '/admin',
//               icon: <DashboardOutlined/>,
//               label: <Link to={'/admin'}>Dashboard</Link>,
//             },
//             {
//                key: '/admin/new-employee',
//               icon: <UserOutlined/>,
//               label: <Link to={'/admin/new-employee'}>New Employee</Link>,
//             },
//           ];
//   const [collapsed, setCollapsed] = useState(false);
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();
//   return (
//     <Layout className='!min-h-screen'>
//       <Sider trigger={null} collapsible collapsed={collapsed}>
//         <div className="demo-logo-vertical" />
//         <Menu
//           theme="dark"
//           mode="inline"
//           defaultSelectedKeys={[pathname]}
//           items={items}
//         />
//       </Sider>
//       <Layout>
//         <Header style={{ padding: 0, background: colorBgContainer }}>
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               fontSize: '16px',
//               width: 64,
//               height: 64,
//             }}
//           />
//         </Header>
//         <Content
//           style={{
//             margin: '24px 16px',
//             padding: 24,
//             minHeight: 280,
//             background: colorBgContainer,
//             borderRadius: borderRadiusLG,
//           }}
//         >
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };
// export default Adminlayout;



import React, { useState } from 'react';
import {
  BranchesOutlined,
  DashboardOutlined,
  DollarCircleFilled,
  GiftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LoginOutlined,
  AccountBookFilled,
  AccountBookOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Breadcrumb, Avatar, Tooltip } from 'antd';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import logo from '../../../src/assets/main.logo.png';
import Cookies from "universal-cookie";


const cookies=new Cookies();

const { Header, Sider, Content, Footer } = Layout;

const Employeelayout = ({ children }) => {


  //logout codding
 const nevigate=useNavigate();
  const logoutFunc=()=>{
    sessionStorage.removeItem("userInfo");
    cookies.remove("authToken");
    nevigate("/");
  }

  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    {
      key: '/employee',
      icon: <DashboardOutlined />, 
      label: <Link to="/employee">Dashboard</Link>,
    },
     {
      key: '/employee/new-account',
      icon: <AccountBookOutlined />, 
      label: <Link to="/employee/new-account">New Account</Link>,
    },
     {
      key: '/employee/new-transaction',
      icon: <BranchesOutlined />, 
      label: <Link to="/employee/new-transaction">New Transaction</Link>,
    },
    {
      key: '/employee/logout',
      icon: <LoginOutlined />,
      label: <Button
      type='text'
      className='!text-grey-300 !font-semibold'
      onClick={logoutFunc}
      >Logout</Button>,
    },
  ];

  const canaraBlue = '#003f6b';
  const lightBlue = '#e6f0fa';
  const accent = '#0075c9';

  return (
    <Layout hasSider style={{ minHeight: '100vh', background: lightBlue, overflow: 'hidden' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: canaraBlue, paddingTop: 20, position: 'fixed', height: '100vh', left: 0, top: 0, bottom: 0, zIndex: 100 }}
      >
        <div
          className="logo"
          style={{
            height: 80,
            margin: '0 16px 24px',
            background: canaraBlue,
            borderRadius: 12,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
          }}
        >
          <img 
            src={logo} 
            alt="SOB Logo" 
            style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              objectFit: 'cover', 
              marginBottom: 4,
              border: '2px solid #fff'
            }} 
          />
          S.O. Bank
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultSelectedKeys={[pathname]}
          items={items}
          style={{ borderRight: 0, background: canaraBlue }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            position: 'fixed',
            top: 0,
            left: collapsed ? 80 : 200,
            right: 0,
            zIndex: 1000,
            background: canaraBlue,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            transition: 'left 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '20px', color: '#fff', marginRight: 16 }}
            />
            <h1 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Employee Panel</h1>
          </div>
          <Tooltip title="Employee Profile">
            <Avatar style={{ backgroundColor: accent, color: '#fff' }}>A</Avatar>
          </Tooltip>
        </Header>

        <Content style={{ marginTop: 64, padding: '24px 24px 0' }}>
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={[{ title: 'Home' }, { title: 'Employee Dashboard' }]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: '#fff',
              borderRadius: borderRadiusLG,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#fff', color: canaraBlue, marginTop: 24 }}>
          Stack Overflow Bank ©{new Date().getFullYear()} — Empowering Devs
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Employeelayout;







