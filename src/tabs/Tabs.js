import React from 'react';
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
const MIN_INDEX = 0;

const tabFilter = tab => !tab.disabled;

class Tabs extends React.Component {
  state = {
    start: null,
    translateX: 0,
    translateLineX: 0,
    isAnimating: false,
    isSwiping: false,
  };

  get filteredTabsLength() {
    return this.props.tabs.filter(tabFilter).length;
  }

  get MAX_INDEX() {
    return this.filteredTabsLength - 1;
  }

  componentDidMount() {
    const { selected } = this.props;

    this.handleTabSelect(clamp(selected, MIN_INDEX, this.MAX_INDEX));
    document.body.addEventListener('touchmove', this.disableTouchBody, { passive: false });
  }

  componentDidUpdate(prevProps) {
    const currentSelected = this.props.selected;
    const prevSelected = prevProps.selected;
    const currentSelectedTab = this.props.tabs[currentSelected];
    const prevSelectedTab = prevProps.tabs[prevSelected];
    const currentDisabledTabsLength = this.props.tabs.filter(tabFilter).length;
    const prevDisabledTabsLength = prevProps.tabs.filter(tabFilter).length;

    if (
      currentSelected !== prevSelected ||
      currentDisabledTabsLength !== prevDisabledTabsLength ||
      (currentSelectedTab && prevSelectedTab
        ? currentSelectedTab.disabled !== prevSelectedTab.disabled
        : false)
    ) {
      this.handleTabSelect(clamp(currentSelected, MIN_INDEX, this.MAX_INDEX));
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.disableTouchBody);
  }

  isTabDisabled = index => {
    const { tabs: allTabs } = this.props;

    return allTabs[index] && allTabs[index].disabled;
  };

  animateLine = index => {
    const { tabs: allTabs } = this.props;
    let nextIndex = index;

    const disabledIndexes = allTabs.slice(0, index).filter(tab => tab.disabled).length;

    while (this.isTabDisabled(nextIndex)) {
      nextIndex += 1;
    }

    this.setState({ translateLineX: `${(nextIndex + disabledIndexes) * 100}%` });
  };

  animatePanel = index => {
    this.setState({
      isAnimating: true,
      translateX: `${-(100 / this.filteredTabsLength) * index}%`,
    });

    setTimeout(() => {
      this.setState({ isAnimating: false });
    }, TRANSITION_DURATION);
  };

  switchTab = index => {
    this.animateLine(index);
    this.animatePanel(index);
  };

  handleTabSelect = index => {
    const { onTabSelect } = this.props;

    this.switchTab(index);
    onTabSelect(index);
  };

  disableTouchBody = e => {
    const { isSwiping } = this.state;

    if (isSwiping) {
      e.preventDefault();
    }
  };

  handleTabClick = index => () => {
    this.handleTabSelect(index);
  };

  handleKeyDown = index => event => {
    if (event && event.keyCode === KeyCodes.ENTER) {
      this.handleTabSelect(index);
    }
  };

  handleTouchStart = event => {
    this.setState({
      start: { x: event.nativeEvent.touches[0].clientX, time: Date.now() },
    });

    event.persist();
  };

  handleTouchEnd = event => {
    const { start } = this.state;
    const { selected } = this.props;
    const end = { x: event.nativeEvent.changedTouches[0].clientX, time: Date.now() };
    const difference = getSwipeDifference(start, end);
    const containerWidth = event.currentTarget.offsetWidth;

    let nextSelected = selected;

    event.persist();

    if (swipeShouldChangeTab(start, end) || difference / containerWidth >= 0.5) {
      if (swipedLeftToRight(start, end)) {
        nextSelected -= 1;
      } else if (swipedRightToLeft(start, end)) {
        nextSelected += 1;
      }
    }

    nextSelected = clamp(nextSelected, MIN_INDEX, this.MAX_INDEX);

    if (nextSelected !== selected) {
      this.handleTabSelect(nextSelected);
    }

    this.setState({ isSwiping: false });
    this.switchTab(nextSelected);
  };

  getContainerWidth = event => event.currentTarget.offsetWidth;

  handleTouchMove = event => {
    const { start } = this.state;
    const { selected } = this.props;
    const end = { x: event.nativeEvent.changedTouches[0].clientX, time: Date.now() };
    const tabWidth = 100 / this.filteredTabsLength;
    const difference = getSwipeDifference(start, end);
    const elasticDrag = 100 * (1 - Math.E ** (-0.002 * difference));
    const containerWidth = this.getContainerWidth(event);

    event.persist();

    let nextSelected = selected;

    if (difference > 5) {
      this.setState({ isSwiping: true });
    }

    if (difference / containerWidth >= 0.5) {
      if (swipedLeftToRight(start, end)) {
        nextSelected -= 1;
      } else if (swipedRightToLeft(start, end)) {
        nextSelected += 1;
      }
    }

    nextSelected = clamp(
      nextSelected,
      Math.max(selected - 1, MIN_INDEX),
      Math.min(selected + 1, this.MAX_INDEX),
    );

    if (nextSelected !== selected) {
      this.animateLine(nextSelected);
    } else {
      this.animateLine(selected);
    }

    let dragDifference;

    if (swipedLeftToRight(start, end)) {
      if (selected > MIN_INDEX) {
        dragDifference = `+ ${Math.min(difference, containerWidth)}`;
      } else {
        dragDifference = `+ ${elasticDrag}`;
      }
    } else if (swipedRightToLeft(start, end)) {
      if (selected < this.MAX_INDEX) {
        dragDifference = `- ${Math.min(difference, containerWidth)}`;
      } else {
        dragDifference = `- ${elasticDrag}`;
      }
    }

    if (dragDifference) {
      this.setState({
        translateX: `calc(-${tabWidth * selected}% ${dragDifference}px)`,
      });
    }
  };

  render() {
    const { tabs: allTabs, changeTabOnSwipe, name, selected } = this.props;
    const { translateLineX, isAnimating, translateX } = this.state;
    const tabs = allTabs.filter(tab => !tab.disabled);

    return (
      <div
        onTouchStart={changeTabOnSwipe && this.handleTouchStart}
        onTouchEnd={changeTabOnSwipe && this.handleTouchEnd}
        onTouchMove={changeTabOnSwipe && this.handleTouchMove}
        className="tabs"
      >
        <TabList>
          {allTabs.map(({ title, disabled }, index) => {
            const selectIndex = tabs.findIndex(tab => tab.title === title);
            return (
              <Tab
                key={title}
                id={`${name}-tab-${index}`}
                panelId={`${name}-panel-${index}`}
                selected={selected === selectIndex}
                disabled={disabled}
                onClick={disabled ? null : this.handleTabClick(selectIndex)}
                handleKeyDown={this.handleKeyDown(selectIndex)}
                style={{
                  width: `${(1 / allTabs.length) * 100}%`,
                }}
              >
                {title}
              </Tab>
            );
          })}
          <div
            className={classNames('tabs__line')}
            style={{
              width: `${(1 / allTabs.length) * 100}%`,
              transform: `translateX(${translateLineX})`,
            }}
          />
        </TabList>
        <div className="tabs__panel-container">
          <div
            className={classNames('tabs__slider', { 'is-animating': isAnimating })}
            style={{
              width: `${this.filteredTabsLength * 100}%`,
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
                  width: `${(1 / this.filteredTabsLength) * 100}%`,
                }}
              >
                {disabled ? null : content}
              </TabPanel>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

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
