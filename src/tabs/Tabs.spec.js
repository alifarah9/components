import React from 'react';
import { mount } from 'enzyme';

import Tabs from './Tabs';
import Tab from './Tab';
import TabPanel from './TabPanel';

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
    jest.clearAllMocks();
  });

  it('renders with right props', () => {
    expect(component.find(Tabs)).toHaveLength(1);
    expect(component.find(Tabs).props()).toEqual({ ...props });
    component.setProps({ selected: 2 });
  });

  it('disables vertical movement after swiping', () => {
    expect(component.state().isSwiping).toBe(false);
    component.simulate('touchstart', createStartTouchEventObject({ x: 0, y: 0 }));
    component.simulate('touchmove', createMoveTouchEventObject({ x: 10, y: 0 }));
    expect(component.state().isSwiping).toBe(true);
    component.simulate('touchend', createMoveTouchEventObject({ x: 20, y: 0 }));
    expect(component.state().isSwiping).toBe(false);
  });

  it('calls onTabSelect when switching tabs', () => {
    jest.spyOn(component.instance(), 'getContainerWidth').mockReturnValue(30);

    component
      .find(Tab)
      .at(2)
      .simulate('click');
    expect(props.onTabSelect).toHaveBeenCalledTimes(1);

    component.simulate('touchstart', createStartTouchEventObject({ x: 0, y: 0 }));
    component.simulate('touchmove', createMoveTouchEventObject({ x: -20, y: 0 }));
    component.simulate('touchend', createMoveTouchEventObject({ x: -25, y: 0 }));

    expect(props.onTabSelect).toHaveBeenCalledTimes(2);
  });

  it('renders the correct amount of tab titles and panels', () => {
    const enabledTabsLength = props.tabs.filter(({ disabled }) => !disabled).length;

    expect(component.find(TabPanel).length).toBe(enabledTabsLength);
    expect(component.find(Tab).length).toBe(props.tabs.length);
  });

  it('updates transforms properly when changing tabs', () => {
    const getLineStyles = () => getComputedStyle(component.find('.tabs__line').getDOMNode());
    const getSliderStyles = () => getComputedStyle(component.find('.tabs__slider').getDOMNode());
    props = {
      ...props,
      tabs: generateTabs([false, true, false, false, false]),
    };
    component = mount(<Tabs {...props} />);

    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(0%)');
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(0%)');

    component.setProps({ selected: 1 });
    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(200%)');
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-25%)');

    component.setProps({ selected: 99 });
    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(400%)');
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-75%)');

    component.setProps({ selected: 2 });
    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(300%)');
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-50%)');

    component.setProps({ selected: 3 });
    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(400%)');
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-75%)');

    component.setProps({ selected: 4 });
    expect(getLineStyles().getPropertyValue('transform')).toBe('translateX(400%)');
    expect(getSliderStyles().getPropertyValue('transform')).toBe('translateX(-75%)');
  });
});

const defaultDisableds = [false, true, false];

function generateTabs(disableds = defaultDisableds) {
  return disableds.map((disabled, index) => ({
    disabled,
    title: `Title ${index}`,
    content: <p>Content {index}</p>,
  }));
}

function createClientXY(x, y) {
  return { clientX: x, clientY: y };
}

export function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { nativeEvent: { touches: [createClientXY(x, y)] } };
}

export function createMoveTouchEventObject({ x = 0, y = 0 }) {
  return {
    nativeEvent: { changedTouches: [createClientXY(x, y)] },
  };
}
