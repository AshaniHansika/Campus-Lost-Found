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
  Space,
  Input,
  Statistic,
  Row,
  Col,
  Popconfirm
} from 'antd';
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  FileTextOutlined,
  FlagOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Search } = Input;

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState({
    reports: false,
    items: false,
    users: false
  });
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    totalItems: 0,
    reportedItems: 0,
    totalUsers: 0,
    bannedUsers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchReports(),
      fetchAllItems(),
      fetchUsers(),
      fetchBannedUsers(),
      fetchStats()
    ]);
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReports = async () => {
    setLoading(prev => ({ ...prev, reports: true }));
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      message.error('Error fetching reports');
      console.error(error);
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
      console.error(error);
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
      console.error(error);
    }
    setLoading(prev => ({ ...prev, users: false }));
  };

  const fetchBannedUsers = async () => {
    try {
      const response = await api.get('/users/banned');
      setBannedUsers(response.data);
    } catch (error) {
      console.error('Error fetching banned users:', error);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/resolve`);
      message.success('Report resolved successfully');
      fetchReports();
      fetchStats();
    } catch (error) {
      message.error('Error resolving report');
      console.error(error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    Modal.confirm({
      title: 'Remove Item',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to remove this item? This action cannot be undone.',
      okText: 'Yes, Remove',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await api.delete(`/items/${itemId}`);
          message.success('Item removed successfully');
          fetchAllItems();
          fetchReports();
          fetchStats();
        } catch (error) {
          message.error('Error removing item');
          console.error(error);
        }
      }
    });
  };

  const handleBanUser = async (userId, userName) => {
    Modal.confirm({
      title: 'Ban User',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ban ${userName}? This will prevent them from posting or claiming items.`,
      okText: 'Yes, Ban',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await api.put(`/users/${userId}/ban`);
          message.success(`${userName} has been banned`);
          fetchUsers();
          fetchBannedUsers();
          fetchStats();
        } catch (error) {
          message.error('Error banning user');
          console.error(error);
        }
      }
    });
  };

  const handleUnbanUser = async (userId, userName) => {
    try {
      await api.put(`/users/${userId}/unban`);
      message.success(`${userName} has been unbanned`);
      fetchUsers();
      fetchBannedUsers();
      fetchStats();
    } catch (error) {
      message.error('Error unbanning user');
      console.error(error);
    }
  };

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const reportColumns = [
    {
      title: 'Item',
      dataIndex: ['itemId', 'title'],
      key: 'item',
      render: (text, record) => (
        <a onClick={() => navigate(`/items/${record.itemId?._id}`)} className="font-medium">
          {text || 'Unknown Item'}
        </a>
      )
    },
    {
      title: 'Reported By',
      dataIndex: ['reporterId', 'name'],
      key: 'reporter',
      render: (text, record) => (
        <span>
          {text || 'Unknown User'}
          {record.reporterId?.email && (
            <div className="text-xs text-gray-400">{record.reporterId.email}</div>
          )}
        </span>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => (
        <Tag color="orange">{text}</Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || 'No description'
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
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/items/${record.itemId?._id}`)}
          >
            View Item
          </Button>
          {record.status === 'pending' && (
            <Button 
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolveReport(record._id)}
            >
              Resolve
            </Button>
          )}
          <Button 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveItem(record.itemId?._id)}
          >
            Remove
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
        <a onClick={() => navigate(`/items/${record._id}`)} className="font-medium">
          {text}
        </a>
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => cat?.replace('_', ' ').toUpperCase()
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
      key: 'user',
      render: (text, record) => (
        <span>
          {text || 'Unknown'}
          {record.userId?.email && (
            <div className="text-xs text-gray-400">{record.userId.email}</div>
          )}
        </span>
      )
    },
    {
      title: 'Created',
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
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/items/${record._id}`)}
          >
            View
          </Button>
          <Button 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveItem(record._id)}
          >
            Remove
          </Button>
        </Space>
      )
    }
  ];

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (id) => id || '—'
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.role !== 'admin' && (
          <Popconfirm
            title="Ban this user?"
            description={`Are you sure you want to ban ${record.name}?`}
            onConfirm={() => handleBanUser(record._id, record.name)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Ban
            </Button>
          </Popconfirm>
        )
      )
    }
  ];

  const bannedUserColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Banned Date',
      dataIndex: 'bannedAt',
      key: 'bannedAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : '—'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          size="small"
          onClick={() => handleUnbanUser(record._id, record.name)}
        >
          Unban
        </Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchAllData}
        >
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Reports"
              value={stats.totalReports}
              prefix={<FlagOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div className="text-sm text-gray-500 mt-2">
              {stats.pendingReports} pending
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Items"
              value={stats.totalItems}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="text-sm text-gray-500 mt-2">
              {stats.reportedItems} reported
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Banned Users"
              value={stats.bannedUsers}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><FlagOutlined /> User Reports ({reports.filter(r => r.status === 'pending').length})</span>} 
            key="1"
          >
            <Table
              columns={reportColumns}
              dataSource={reports}
              rowKey="_id"
              loading={loading.reports}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane 
            tab={<span><FileTextOutlined /> Manage Posts ({items.length})</span>} 
            key="2"
          >
            <div className="mb-4">
              <Search
                placeholder="Search items by title or description..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={setSearchText}
                onChange={(e) => !e.target.value && setSearchText('')}
                className="max-w-md"
              />
            </div>
            <Table
              columns={itemColumns}
              dataSource={filteredItems}
              rowKey="_id"
              loading={loading.items}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane 
            tab={<span><UserOutlined /> Users ({users.length})</span>} 
            key="3"
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="_id"
              loading={loading.users}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={<span><ExclamationCircleOutlined /> Banned Users ({bannedUsers.length})</span>} 
            key="4"
          >
            <Table
              columns={bannedUserColumns}
              dataSource={bannedUsers}
              rowKey="_id"
              locale={{ emptyText: 'No banned users' }}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminPanel;