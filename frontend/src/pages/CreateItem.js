import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Card,
  message,
  Space
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const CreateItem = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    // Handle file uploads first
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });
    
    // Append other form data
    Object.keys(values).forEach(key => {
      if (key === 'date') {
        formData.append(key, values[key].format('YYYY-MM-DD'));
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await axios.post('/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      message.success('Item posted successfully!');
      navigate(`/items/${response.data._id}`);
    } catch (error) {
      message.error('Error posting item');
      console.error(error);
    }
    setLoading(false);
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Post Lost/Found Item">
       <p className="text-gray-600 mb-4">Create item form is under construction.</p>
       <Button type="primary">Submit Post</Button>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: 'lost' }}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="lost">Lost Item</Option>
              <Option value="found">Found Item</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g., Black Wallet Lost in Library" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="id_card">ID Card</Option>
              <Option value="wallet">Wallet</Option>
              <Option value="phone">Phone</Option>
              <Option value="keys">Keys</Option>
              <Option value="bag">Bag</Option>
              <Option value="laptop">Laptop</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="library">Library</Option>
              <Option value="cafeteria">Cafeteria</Option>
              <Option value="auditorium">Auditorium</Option>
              <Option value="sports_complex">Sports Complex</Option>
              <Option value="academic_block">Academic Block</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date Lost/Found"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="Provide detailed description..." />
          </Form.Item>

          <Form.Item
            label="Photos (Optional)"
          >
            <Upload {...uploadProps} listType="picture-card">
              {fileList.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Verification Questions for Found Items */}
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) => 
              getFieldValue('type') === 'found' && (
                <Card title="Verification Questions" size="small" className="mb-4">
                  <p className="text-gray-500 mb-4">
                    Add questions to verify claimers (e.g., "What color is the wallet?")
                  </p>
                  
                  <Form.List name="questions">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'question']}
                              rules={[{ required: true, message: 'Question required' }]}
                            >
                              <Input placeholder="Enter question" />
                            </Form.Item>
                            <Button onClick={() => remove(name)}>Remove</Button>
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block>
                            Add Question
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              )
            }
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Post Item
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateItem;