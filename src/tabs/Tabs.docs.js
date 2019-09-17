import React, { useState } from 'react';
import Tabs from './Tabs';
import Alert from '../alert';

const TabsDocs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabz = [
    {
      title: 'Title 1',
      content: <Alert>content</Alert>,
    },
    {
      title: 'Title 2',
      content: <Alert type="warning">different content</Alert>,
    },
    {
      title: 'Title 3',
      content: <Alert type="error">more content</Alert>,
    },
  ];

  const handleTabSelect = index => {
    setSelectedTab(index);
  };

  return (
    <div className="container">
      <section className="section">
        <div className="row">
          <div className="col-md-6">
            <h2>Tabs</h2>
            <p>Wat is tab</p>
          </div>
          <div className="col-md-6 m-t-2">
            <Tabs
              name="tabs-docs"
              tabs={tabz}
              selected={selectedTab}
              onTabSelect={handleTabSelect}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TabsDocs;
