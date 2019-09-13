import React from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import TabList from './TabList';
import TabPanel from './TabPanel';

const Tabs = ({ tabz, selected, onTabSelect, name }) => {
  const handleTabSelect = index => () => {
    onTabSelect(index);
  };

  return (
    <>
      <TabList>
        {tabz.map(({ title }, index) => (
          <Tab
            key={title}
            id={`${name}-tab-${index}`}
            panelId={`${name}-panel-${index}`}
            selected={selected === index}
            onClick={handleTabSelect(index)}
          >
            {title}
          </Tab>
        ))}
      </TabList>
      {tabz.map(({ content }, index) => (
        <TabPanel
          key={tabz[index].title}
          tabId={`${name}-tab-${index}`}
          id={`${name}-panel-${index}`}
          selected={selected === index}
        >
          {content}
        </TabPanel>
      ))}
    </>
  );
};

Tabs.propTypes = {
  tabz: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.number.isRequired,
  onTabSelect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default Tabs;
