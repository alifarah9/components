import React, { useState } from 'react';
import Tab from './Tab';
import TabList from './TabList';
import TabPanel from './TabPanel';

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

  return (
    <div className="container">
      <section className="section">
        <div className="row">
          <div className="col-md-6">
            <h2>Tabs</h2>
            <p>Wat is tab</p>
          </div>
          <div className="col-md-6 m-t-2">
            <TabList>
              {tabz.map(({ title }, index) => (
                <Tab
                  key={title}
                  id={`docs-tab-${index}`}
                  panelId={`docs-panel-${index}`}
                  selected={selectedTab === index}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {title}
                </Tab>
              ))}
            </TabList>
            {tabz.map(({ content }, index) => (
              <TabPanel
                key={tabz[index].title}
                tabId={`docs-tab-${index}`}
                id={`docs-panel-${index}`}
                selected={selectedTab === index}
              >
                {content}
              </TabPanel>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TabsDocs;
