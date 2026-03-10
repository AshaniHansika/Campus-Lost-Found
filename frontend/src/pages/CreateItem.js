import React, {useState} from 'react';
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
    
    //Handle file uploads first
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
}