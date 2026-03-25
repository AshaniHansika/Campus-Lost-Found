import React from 'react';
import { Card, Tabs } from 'antd';

const { TabPane } = Tabs;

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="My Posts" key="1">
            <p>Your posts will appear here</p>
          </TabPane>
          <TabPane tab="My Claims" key="2">
            <p>Your claims will appear here</p>
          </TabPane>
          <TabPane tab="Claims on My Items" key="3">
            <p>Claims on your items will appear here</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Dashboard;