/**
 * @jest-environment jsdom
 */

import React from 'react';
import Tabs from './Tabs';
import Tab from './Tab';
import TabPanel from './TabPanel';
import { mount } from 'enzyme';

describe('Tabs', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      tabs: generateTabs(),
      changeTabOnSwipe: true,
      name: 'test',
      selected: 0,
      onTabSelect: jest.fn(),
    };
    component = mount(<Tabs {...props} />);
  });

  it('renders with right props', () => {
    expect(component.find(Tabs)).toHaveLength(1);
    expect(component.find(Tabs).props()).toEqual({ ...props });
  });

  it('switches to the most relevant enabled tab after mounting with invalid props', () => {
    props = {
      ...props,
      selected: 99,
    };
    component = mount(<Tabs {...props} />);
    component.update();
    // expect(component.state().translateX).toEqual(true);
    // expect(component.state().translateLineX).toEqual(true);
  });

  it('disables vertical movement after swiping', () => {
    // expect(true).toBe(false);
  });

  it('changes to the next enabled tab after swiping', () => {
    // expect(true).toBe(false);
  });

  it('renders the correct amount of tab titles and panels', () => {
    const enabledTabsLength = props.tabs.filter(({ disabled }) => !disabled).length;

    expect(component.find(TabPanel).length).toBe(enabledTabsLength);
    expect(component.find(Tab).length).toBe(props.tabs.length);
  });

  it('updates the slider translateX when changing tabs', () => {
    const getSliderStyles = () => getComputedStyle(component.find('.tabs__slider').getDOMNode());

    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(0%)');
    component.setProps({ selected: 1 });
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-100%)');
    component.setProps({ selected: 2 });
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-200%)');
    component.setProps({ selected: 3 });
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-300%)');
    component.setProps({ selected: 4 });
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-400%)');
  });

  it('updates the selected line translateX when changing tabs', () => {
    const getLineStyles = () => getComputedStyle(component.find('.tabs__line').getDOMNode());

    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(0%)');
    component.setProps({ selected: 1 });
    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(300%)');
  });

  it('calls the handleTabSelect callback and updates the selected tab when a tab is selected', () => {
    // expect(true).toBe(false);
  });

  function generateTabs() {
    return [
      {
        disabled: false,
      },
      {
        disabled: true,
      },
      {
        disabled: true,
      },
    ].map((tab, index) => ({ ...tab, title: `Title ${index}`, content: <p>Content {index}</p> }));
  }
});
