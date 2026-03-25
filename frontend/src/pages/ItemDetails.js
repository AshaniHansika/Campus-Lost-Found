import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'antd';

const ItemDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Item Details</h1>
        <p>Item ID: {id}</p>
        <p className="mt-4 text-gray-600">This page is under construction.</p>
        <Button type="primary" className="mt-4">Claim Item</Button>
      </Card>
    </div>
  );
};

export default ItemDetails;