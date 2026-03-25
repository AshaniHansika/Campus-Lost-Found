import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tabs,
  Button,
  Tag,
  Modal,
  message,
  Badge,
  Space
} from 'antd';
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    reports: false,
    items: false,
    users: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    fetchAllItems();
    fetchUsers();
  }, []);

  const fetchReports = async () => {
    setLoading(prev => ({ ...prev, reports: true }));
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      message.error('Error fetching reports');
    }
    setLoading(prev => ({ ...prev, reports: false }));
  };

  const fetchAllItems = async () => {
    setLoading(prev => ({ ...prev, items: true }));
    try {
      const response = await api.get('/items/all');
      setItems(response.data);
    } catch (error) {
      message.error('Error fetching items');
    }
    setLoading(prev => ({ ...prev, items: false }));
  };

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Error fetching users');
    }
    setLoading(prev => ({ ...prev, users: false }));
  };

  const handleResolveReport = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/resolve`);
      message.success('Report resolved');
      fetchReports();
    } catch (error) {
      message.error('Error resolving report');
    }
  };

  const handleRemoveItem = async (itemId) => {
    Modal.confirm({
      title: 'Remove Item',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to remove this item?',
      onOk: async () => {
        try {
          await api.delete(`/items/${itemId}`);
          message.success('Item removed');
          fetchAllItems();
          fetchReports();
        } catch (error) {
          message.error('Error removing item');
        }
      }
    });
  };

  const handleBanUser = async (userId) => {
    Modal.confirm({
      title: 'Ban User',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to ban this user?',
      onOk: async () => {
        try {
          await api.put(`/users/${userId}/ban`);
          message.success('User banned');
          fetchUsers();
        } catch (error) {
          message.error('Error banning user');
        }
      }
    });
  };

  const reportColumns = [
    {
      title: 'Item',
      dataIndex: ['itemId', 'title'],
      key: 'item',
      render: (text, record) => (
        <a onClick={() => navigate(`/items/${record.itemId?._id}`)}>{text}</a>
      )
    },
    {
      title: 'Reported By',
      dataIndex: ['reporterId', 'name'],
      key: 'reporter'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'pending' ? 'warning' : 'success'}
          text={status.toUpperCase()}
        />
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/items/${record.itemId?._id}`)}
          >
            View
          </Button>
          <Button 
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleResolveReport(record._id)}
            disabled={record.status !== 'pending'}
          >
            Resolve
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveItem(record.itemId?._id)}
          >
            Remove Item
          </Button>
        </Space>
      )
    }
  ];

  const itemColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => navigate(`/items/${record._id}`)}>{text}</a>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'lost' ? 'red' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'active' ? 'blue' :
          status === 'claimed' ? 'orange' :
          status === 'returned' ? 'green' : 'red'
        }>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'User',
      dataIndex: ['userId', 'name'],
      key: 'user'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record._id)}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="User Reports" key="1">
            <Table
              columns={reportColumns}
              dataSource={reports}
              rowKey="_id"
              loading={loading.reports}
            />
          </TabPane>

          <TabPane tab="Manage Posts" key="2">
            <Table
              columns={itemColumns}
              dataSource={items}
              rowKey="_id"
              loading={loading.items}
            />
          </TabPane>

          <TabPane tab="Banned Listings" key="3">
            <Table
              columns={[
                {
                  title: 'User',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email'
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: () => <Tag color="red">Banned</Tag>
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: () => (
                    <Button type="link">Unban</Button>
                  )
                }
              ]}
              dataSource={[]}
              rowKey="_id"
              locale={{ emptyText: 'No banned users' }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminPanel;