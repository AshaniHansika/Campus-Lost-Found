import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Row, Col, Tag, Empty, Spin, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const { Option } = Select;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    location: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.search) params.search = filters.search;
      
      const response = await api.get('/items', { params });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      message.error('Failed to load items');
    }
    setLoading(false);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      wallet: '👛',
      phone: '📱',
      keys: '🔑',
      id_card: '🆔',
      bag: '🎒',
      laptop: '💻',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Campus Lost & Found</h1>
        <p className="text-gray-600">Find your lost items or help others find theirs</p>
      </div>

      <Card className="mb-8 shadow-md">
        <div className="space-y-4">
          <Input
            size="large"
            placeholder="Keyword Search..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full"
          />

          <Row gutter={16}>
            <Col span={8}>
              <Select
                placeholder="Lost or Found"
                className="w-full"
                allowClear
                value={filters.type}
                onChange={(value) => setFilters({ ...filters, type: value })}
              >
                <Option value="lost">Lost</Option>
                <Option value="found">Found</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                placeholder="Category"
                className="w-full"
                allowClear
                value={filters.category}
                onChange={(value) => setFilters({ ...filters, category: value })}
              >
                <Option value="wallet">Wallet</Option>
                <Option value="phone">Phone</Option>
                <Option value="keys">Keys</Option>
                <Option value="id_card">ID Card</Option>
                <Option value="bag">Bag</Option>
                <Option value="laptop">Laptop</Option>
                <Option value="other">Other</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                placeholder="Location"
                className="w-full"
                allowClear
                value={filters.location}
                onChange={(value) => setFilters({ ...filters, location: value })}
              >
                <Option value="library">Library</Option>
                <Option value="dormitory">Dormitory</Option>
                <Option value="student_center">Student Center</Option>
                <Option value="cafeteria">Cafeteria</Option>
                <Option value="academic_block">Academic Block</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <Empty description="No items found" />
      ) : (
        <Row gutter={[24, 24]}>
          {items.map(item => (
            <Col xs={24} sm={12} lg={8} key={item._id}>
              <Card
                hoverable
                className="h-full shadow-md hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/items/${item._id}`)}
              >
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xl mr-2">{getCategoryIcon(item.category)}</span>
                      <span className="text-lg font-semibold">{item.title}</span>
                    </div>
                    <Tag color={item.type === 'lost' ? 'red' : 'green'}>
                      {item.type.toUpperCase()}
                    </Tag>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-blue-500" />
                    <span>at {item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-green-500" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 line-clamp-2">
                  {item.description}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Home;