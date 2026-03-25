import React from 'react';
import { Layout as AntLayout } from 'antd';
import Navbar from './Navbar';

const { Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  return (
    <AntLayout className="min-h-screen">
      <Navbar />
      <Content>
        {children}
      </Content>
      <Footer className="text-center">
        Campus Lost & Found ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  );
};

export default Layout;