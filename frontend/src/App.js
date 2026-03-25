import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

// Layout components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetails from './pages/ItemDetails';
import CreateItem from './pages/CreateItem';
import Dashboard from './pages/Dashboard';
import ClaimDetails from './pages/ClaimDetails';
import AdminPanel from './pages/AdminPanel';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                
                {/* Protected Routes */}
                <Route path="/create-item" element={
                  <PrivateRoute>
                    <CreateItem />
                  </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/claims/:id" element={
                  <PrivateRoute>
                    <ClaimDetails />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute adminOnly>
                    <AdminPanel />
                  </PrivateRoute>
                } />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;