import React from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  PlusCircleOutlined, 
  UserOutlined, 
  LoginOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    ...(isAuthenticated ? [
      {
        key: 'create',
        icon: <PlusCircleOutlined />,
        label: <Link to="/create-item">Post Item</Link>,
      },
      {
        key: 'dashboard',
        icon: <UserOutlined />,
        label: <Link to="/dashboard">Dashboard</Link>,
      }
    ] : [])
  ];

  return (
    <Header className="flex items-center justify-between bg-white shadow-md px-6">
      <div className="flex items-center">
        <div className="text-xl font-bold text-blue-600 mr-8">
          <Link to="/" className="text-blue-600">Campus Lost & Found</Link>
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          className="border-0 flex-1"
          style={{ minWidth: 'auto' }}
        />
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Avatar icon={<UserOutlined />} />
            <span className="text-gray-700">{user?.name}</span>
            <Button 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              type="text"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="link" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;