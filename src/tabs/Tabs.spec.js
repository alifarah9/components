import React from 'react';
import Tabs from './Tabs';
import { tabs } from './Tabs.docs';
import { mount } from 'enzyme';

describe('Sticky', () => {
  let component;
  const props = {
    tabs,
    changeTabOnSwipe: true,
    name: 'test',
    selected: 0,
    onTabSelect: jest.fn(),
  };

  it('renders with right props', () => {
    component = mount(<Tabs {...props} />);
    expect(component.find(Tabs)).toHaveLength(1);
    expect(component.find(Tabs).props()).toEqual({ ...props });
  });

  it('switches to the most relevant enabled tab after mounting with invalid props', () => {
    expect(true).toBe(false);
  });

  it('disables vertical movement after swiping', () => {
    expect(true).toBe(false);
  });

  it('changes to the next enabled tab after swiping', () => {
    expect(true).toBe(false);
  });

  it('renders all tab titles, including disabled ones', () => {
    expect(true).toBe(false);
  });

  it('does not render disabled tab panels', () => {
    expect(true).toBe(false);
  });

  it('updates the panel translateX when changing tabs', () => {
    expect(true).toBe(false);
  });

  it('updates the selected line translateX when changing tabs', () => {
    expect(true).toBe(false);
  });

  it('calls the handleTabSelect callback and updates the selected tab when a tab is selected', () => {
    expect(true).toBe(false);
  });
});
