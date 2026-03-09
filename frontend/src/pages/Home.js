import React, { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker, Button, Space, Card, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    location: '',
    search: ''
  });

  const navigate = useNavigate();

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...filters
      };
      
      const response = await axios.get('/api/items', { params });
      setItems(response.data.items);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const columns = [
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => cat.replace('_', ' ').toUpperCase()
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
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
    }
  ];

  return (
    <div className="p-6">
      <Card className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <Input
            placeholder="Search items..."
            prefix={<SearchOutlined />}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full"
          />
          
          <Space wrap>
            <Select
              placeholder="Type"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, type: value })}
            >
              <Option value="lost">Lost</Option>
              <Option value="found">Found</Option>
            </Select>

            <Select
              placeholder="Category"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, category: value })}
            >
              <Option value="id_card">ID Card</Option>
              <Option value="wallet">Wallet</Option>
              <Option value="phone">Phone</Option>
              <Option value="keys">Keys</Option>
              <Option value="bag">Bag</Option>
              <Option value="laptop">Laptop</Option>
              <Option value="other">Other</Option>
            </Select>

            <Select
              placeholder="Location"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, location: value })}
            >
              <Option value="library">Library</Option>
              <Option value="cafeteria">Cafeteria</Option>
              <Option value="auditorium">Auditorium</Option>
              <Option value="sports_complex">Sports Complex</Option>
              <Option value="academic_block">Academic Block</Option>
            </Select>

            <RangePicker 
              onChange={(dates) => {
                if (dates) {
                  setFilters({
                    ...filters,
                    startDate: dates[0].format('YYYY-MM-DD'),
                    endDate: dates[1].format('YYYY-MM-DD')
                  });
                }
              }}
            />
          </Space>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => fetchItems(page)
        }}
      />
    </div>
  );
};

export default Home;