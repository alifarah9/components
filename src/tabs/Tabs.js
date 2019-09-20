import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import clamp from 'lodash.clamp';

import Tab from './Tab';
import TabList from './TabList';
import TabPanel from './TabPanel';
import KeyCodes from '../common/keyCodes';
import {
  getSwipeDifference,
  swipedLeftToRight,
  swipedRightToLeft,
  swipeShouldChangeTab,
} from './utils';

import './Tabs.less';

const TRANSITION_DURATION = 300;

const Tabs = ({ tabs, selected, onTabSelect, name, changeTabOnSwipe }) => {
  const tabsLength = tabs.length;
  const MIN_INDEX = 0;
  const MAX_INDEX = tabsLength - 1;
  const [start, setStart] = useState();
  const [translateX, setTranslateX] = useState(0);
  const [translateLineX, setTranslateLineX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const isTabDisabled = index => tabs[index] && tabs[index].disabled;

  const animateLine = index => {
    setTranslateLineX(`${index * 100}%`);
  };

  const animatePanel = index => {
    setIsAnimating(true);

    setTranslateX(`${-(100 / tabsLength) * index}%`);

    setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_DURATION);
  };

  const switchTab = index => {
    animateLine(index);
    animatePanel(index);
  };

  const handleTabSelect = index => {
    switchTab(index);
    onTabSelect(index);
  };

  useEffect(() => {
    const FORWARD = 1;
    const REVERSE = -1;
    let direction = selected >= tabsLength - 1 ? REVERSE : FORWARD;
    let newSelected = clamp(selected, MIN_INDEX, MAX_INDEX);

    while (isTabDisabled(newSelected)) {
      if (direction === FORWARD && newSelected >= MAX_INDEX) {
        direction = REVERSE;
      } else if (direction === REVERSE && newSelected <= MIN_INDEX) {
        direction = FORWARD;
      }

      newSelected += direction;
    }

    handleTabSelect(newSelected);
  }, []);

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
    const difference = getSwipeDifference(start, end);
    const containerWidth = event.currentTarget.offsetWidth;

    let nextSelected = selected;

    event.persist();

    if (swipeShouldChangeTab(start, end) || difference / containerWidth >= 0.5) {
      if (swipedLeftToRight(start, end)) {
        nextSelected -= 1;
        while (isTabDisabled(nextSelected)) {
          nextSelected -= 1;
        }
      } else if (swipedRightToLeft(start, end)) {
        nextSelected += 1;
        while (isTabDisabled(nextSelected)) {
          nextSelected += 1;
        }
      }
    }

    nextSelected = clamp(nextSelected, MIN_INDEX, MAX_INDEX);

    if (tabs[nextSelected].disabled) {
      nextSelected = selected;
    }

    if (nextSelected !== selected) {
      handleTabSelect(nextSelected);
    }

    switchTab(nextSelected);
  };

  const handleTouchMove = event => {
    const end = { x: event.nativeEvent.changedTouches[0].clientX, time: Date.now() };
    const tabWidth = 100 / tabsLength;
    const difference = getSwipeDifference(start, end);
    const containerWidth = event.currentTarget.offsetWidth;

    event.persist();

    let nextSelected = selected;

    if (difference / containerWidth >= 0.5) {
      if (swipedLeftToRight(start, end)) {
        while (isTabDisabled(nextSelected)) {
          nextSelected -= 1;
        }
      } else if (swipedRightToLeft(start, end)) {
        while (isTabDisabled(nextSelected)) {
          nextSelected += 1;
        }
      }
    }

    nextSelected = clamp(
      nextSelected,
      Math.max(selected - 1, MIN_INDEX),
      Math.min(selected + 1, MAX_INDEX),
    );

    if (nextSelected !== selected) {
      animateLine(nextSelected);
    } else {
      animateLine(selected);
    }

    if (swipedLeftToRight(start, end) && selected > MIN_INDEX) {
      setTranslateX(`calc(-${tabWidth * selected}% + ${Math.min(difference, containerWidth)}px)`);
    } else if (swipedRightToLeft(start, end) && selected < MAX_INDEX) {
      setTranslateX(`calc(-${tabWidth * selected}% - ${Math.min(difference, containerWidth)}px)`);
    }
  };

  if (!tabs.filter(({ disabled }) => !disabled).length) {
    throw new Error('All tabs should not be disabled');
  }

  return (
    <div
      onTouchStart={changeTabOnSwipe && handleTouchStart}
      onTouchEnd={changeTabOnSwipe && handleTouchEnd}
      onTouchMove={changeTabOnSwipe && handleTouchMove}
      className="tabs"
    >
      <TabList>
        {tabs.map(({ title, disabled }, index) => (
          <Tab
            key={title}
            id={`${name}-tab-${index}`}
            panelId={`${name}-panel-${index}`}
            selected={selected === index}
            disabled={disabled}
            onClick={disabled ? null : handleTabClick(index)}
            handleKeyDown={handleKeyDown(index)}
            style={{
              width: `${(1 / tabsLength) * 100}%`,
            }}
          >
            {title}
          </Tab>
        ))}
        <div
          className={classNames('tabs__line')}
          style={{
            width: `${(1 / tabsLength) * 100}%`,
            transform: `translateX(${translateLineX})`,
          }}
        />
      </TabList>
      <div className="tabs__panel-container">
        <div
          className={classNames('tabs__slider', { 'is-animating': isAnimating })}
          style={{
            width: `${tabsLength * 100}%`,
            transform: `translateX(${translateX})`,
          }}
        >
          {tabs.map(({ content, disabled }, index) => (
            <TabPanel
              key={tabs[index].title}
              tabId={`${name}-tab-${index}`}
              id={`${name}-panel-${index}`}
              disabled={disabled}
              style={{
                width: `${(1 / tabsLength) * 100}%`,
              }}
            >
              {disabled ? null : content}
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
