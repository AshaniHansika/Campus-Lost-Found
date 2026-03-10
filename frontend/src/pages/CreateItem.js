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
}}