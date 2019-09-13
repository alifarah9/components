import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import TabList from './TabList';
import TabPanel from './TabPanel';
import KeyCodes from '../common/keyCodes';

import './Tabs.less';

const Tabs = ({ tabs, selected, onTabSelect, name }) => {
  const [start, setStart] = useState();
  const handleTabSelect = index => () => {
    onTabSelect(index);
  };

  const handleKeyDown = index => event => {
    if (event && event.keyCode === KeyCodes.ENTER) {
      onTabSelect(index);
    }
  };

  const handleTouchStart = event => {
    setStart(event.nativeEvent.touches[0].clientX);
    event.persist();
  };

  const handleTouchEnd = event => {
    const end = event.nativeEvent.changedTouches[0].clientX;

    event.persist();

    // todo: cleanup
    if (end > start && end - start > 50 && selected > 0) {
      onTabSelect(selected - 1);
    } else if (start > end && start - end > 50 && selected < tabs.length - 1) {
      onTabSelect(selected + 1);
    }
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <TabList>
        {tabs.map(({ title }, index) => (
          <Tab
            key={title}
            id={`${name}-tab-${index}`}
            panelId={`${name}-panel-${index}`}
            selected={selected === index}
            onClick={handleTabSelect(index)}
            handleKeyDown={handleKeyDown(index)}
          >
            {title}
          </Tab>
        ))}
      </TabList>
      {tabs.map(({ content }, index) => (
        <TabPanel
          key={tabs[index].title}
          tabId={`${name}-tab-${index}`}
          id={`${name}-panel-${index}`}
          selected={selected === index}
        >
          {content}
        </TabPanel>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
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
