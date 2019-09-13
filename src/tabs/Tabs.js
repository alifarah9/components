import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

import Tab from './Tab';
import TabList from './TabList';
import TabPanel from './TabPanel';
import KeyCodes from '../common/keyCodes';

import './Tabs.less';

const MIN_SWIPE_DISTANCE = 50;

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

  const userSwiped = difference => Math.abs(difference) > MIN_SWIPE_DISTANCE;

  const handleTouchEnd = event => {
    const end = event.nativeEvent.changedTouches[0].clientX;

    event.persist();

    // todo: cleanup
    if (end > start && userSwiped(end - start) && selected > 0) {
      onTabSelect(selected - 1);
    } else if (start > end && userSwiped(start - end) && selected < tabs.length - 1) {
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
        <CSSTransition
          in={index === selected}
          timeout={{
            appear: 2000,
            enter: 2000,
            exit: 2000,
          }}
          unmountOnExit
        >
          <TabPanel
            key={tabs[index].title}
            tabId={`${name}-tab-${index}`}
            id={`${name}-panel-${index}`}
            selected={selected === index}
          >
            {content}
          </TabPanel>
        </CSSTransition>
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
