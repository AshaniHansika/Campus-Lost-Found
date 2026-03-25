import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;