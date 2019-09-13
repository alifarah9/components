import React, { useState } from 'react';
import Tabs from './Tabs';

const TabsDocs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabz = [
    {
      title: 'Title 1',
      content: <p>I am what ever</p>,
    },
    {
      title: 'Title 2',
      content: (
        <p>
          I am something <strong>completely</strong> different
        </p>
      ),
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
              tabz={tabz}
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
