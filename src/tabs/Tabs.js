import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tab from './Tab';
import TabList from './TabList';
import TabPanel from './TabPanel';
import KeyCodes from '../common/keyCodes';

import './Tabs.less';

const MIN_SWIPE_DISTANCE = 50;

const userSwiped = difference => Math.abs(difference) > MIN_SWIPE_DISTANCE;

const Tabs = ({ tabs, selected, onTabSelect, name, changeTabOnSwipe }) => {
  const tabsLength = tabs.length;
  const [start, setStart] = useState();
  const [translateX, setTranslateX] = useState(0);
  const [translateLineX, setTranslateLineX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const translateTab = index => {
    setTranslateX(`${-(100 / tabsLength) * index}%`);
    setTranslateLineX(`${index * 100}%`);
  };

  const handleTabSelect = index => {
    if (index > selected) {
      // TODO: next tab
    } else if (index < selected) {
      // TODO: prev tab
    }
    translateTab(index);
    onTabSelect(index);
  };

  const handleTabClick = index => () => {
    handleTabSelect(index);
  };

  const handleKeyDown = index => event => {
    if (event && event.keyCode === KeyCodes.ENTER) {
      handleTabSelect(index);
    }
  };

  const handleTouchStart = event => {
    setStart({ x: event.nativeEvent.touches[0].clientX, time: Date.now() });

    event.persist();
  };

  const handleTouchEnd = event => {
    const end = { x: event.nativeEvent.changedTouches[0].clientX, time: Date.now() };
    let nextSelected = selected;
    setIsAnimating(true);

    event.persist();

    const timePassed = start.time - end.time;

    // todo: cleanup
    if (
      end.x > start.x &&
      (userSwiped(end.x - start.x) || ((end.x - start.x) / timePassed > 0.1 && selected > 0))
    ) {
      handleTabSelect(selected - 1);
      nextSelected -= 1;
    } else if (
      start.x > end.x &&
      (userSwiped(start.x - end.x) || (start.x - end.x) / timePassed > 0.1) &&
      selected < tabsLength - 1
    ) {
      handleTabSelect(selected + 1);
      nextSelected += 1;
      handleTabSelect(nextSelected);
    }
    translateTab(nextSelected);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleTouchMove = event => {
    const current = event.nativeEvent.changedTouches[0].clientX;

    event.persist();

    if (current > start.x) {
      setTranslateX(`${current - start.x}px`);
    } else if (start.x > current) {
      setTranslateX(`-${start.x - current}px`);
    }
  };

  return (
    <div
      onTouchStart={changeTabOnSwipe && handleTouchStart}
      onTouchEnd={changeTabOnSwipe && handleTouchEnd}
      onTouchMove={changeTabOnSwipe && handleTouchMove}
    >
      <TabList>
        {tabs.map(({ title }, index) => (
          <Tab
            key={title}
            id={`${name}-tab-${index}`}
            panelId={`${name}-panel-${index}`}
            selected={selected === index}
            onClick={handleTabClick(index)}
            handleKeyDown={handleKeyDown(index)}
            style={{
              width: `${(1 / tabsLength) * 100}%`,
            }}
          >
            {title}
          </Tab>
        ))}
        <div
          className="tabs__line"
          style={{
            width: `${(1 / tabsLength) * 100}%`,
            transform: `translateX(${translateLineX})`,
          }}
        />
      </TabList>
      <div className="tabs__panel-container">
        <div
          className={classnames('tabs__slider', { 'is-animating': isAnimating })}
          style={{
            width: `${tabsLength * 100}%`,
            transform: `translateX(${translateX})`,
          }}
        >
          {tabs.map(({ content }, index) => (
            <TabPanel
              key={tabs[index].title}
              tabId={`${name}-tab-${index}`}
              id={`${name}-panel-${index}`}
            >
              {content}
            </TabPanel>
          ))}
        </div>
      </div>
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
  changeTabOnSwipe: PropTypes.bool,
};

Tabs.defaultProps = {
  changeTabOnSwipe: true,
};

export default Tabs;
