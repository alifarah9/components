import { Children, cloneElement } from 'react';

let count = 0;

export function uuid() {
  count += count + 1;

  return `tw-tabz-${count}`;
}

export function reset() {
  count = 0;
}

export function childrenPropType(props, propName, componentName) {
  let error;
  let tabsCount = 0;
  let panelsCount = 0;
  let tabListFound = false;
  const listTabs = [];
  const children = props[propName];

  deepForEach(children, child => {
    if (isTabList(child)) {
      if (child.props && child.props.children && typeof child.props.children === 'object') {
        deepForEach(child.props.children, listChild => listTabs.push(listChild));
      }

      if (tabListFound) {
        error = new Error(
          "Found multiple 'TabList' components inside 'Tabs'. Only one is allowed.",
        );
      }
      tabListFound = true;
    }
    if (isTab(child)) {
      if (!tabListFound || listTabs.indexOf(child) === -1) {
        error = new Error(
          "Found a 'Tab' component outside of the 'TabList' component. 'Tab' components " +
            "have to be inside the 'TabList' component.",
        );
      }
      tabsCount += 1;
    } else if (isTabPanel(child)) {
      panelsCount += 1;
    }
  });

  if (!error && tabsCount !== panelsCount) {
    error = new Error(
      `There should be an equal number of 'Tab' and 'TabPanel' in \`${componentName}\`. ` +
        `Received ${tabsCount} 'Tab' and ${panelsCount} 'TabPanel'.`,
    );
  }

  return error;
}

export function onSelectPropType(props, propName, componentName, location, propFullName) {
  const prop = props[propName];
  const name = propFullName || propName;
  let error = null;

  if (prop && typeof prop !== 'function') {
    error = new Error(
      `Invalid ${location} \`${name}\` of type \`${typeof prop}\` supplied ` +
        `to \`${componentName}\`, expected \`function\`.`,
    );
  } else if (props.selectedIndex != null && prop == null) {
    error = new Error(
      `The ${location} \`${name}\` is marked as required in \`${componentName}\`, but ` +
        `its value is \`undefined\` or \`null\`.\n` +
        `\`onSelect\` is required when \`selectedIndex\` is also set. Not doing so will ` +
        `make the tabs not do anything, as \`selectedIndex\` indicates that you want to ` +
        `handle the selected tab yourself.\n` +
        `If you only want to set the inital tab replace \`selectedIndex\` with \`defaultIndex\`.`,
    );
  }

  return error;
}

export function selectedIndexPropType(props, propName, componentName, location, propFullName) {
  const prop = props[propName];
  const name = propFullName || propName;
  let error = null;

  if (prop != null && typeof prop !== 'number') {
    error = new Error(
      `Invalid ${location} \`${name}\` of type \`${typeof prop}\` supplied to ` +
        `\`${componentName}\`, expected \`number\`.`,
    );
  } else if (props.defaultIndex != null && prop != null) {
    return new Error(
      `The ${location} \`${name}\` cannot be used together with \`defaultIndex\` ` +
        `in \`${componentName}\`.\n` +
        `Either remove \`${name}\` to let \`${componentName}\` handle the selected ` +
        `tab internally or remove \`defaultIndex\` to handle it yourself.`,
    );
  }

  return error;
}

export function getTabsCount(children) {
  let tabCount = 0;
  deepForEach(children, child => {
    if (isTab(child)) tabCount += 1;
  });

  return tabCount;
}

export function getPanelsCount(children) {
  let panelCount = 0;
  deepForEach(children, child => {
    if (isTabPanel(child)) panelCount += 1;
  });

  return panelCount;
}

function makeTypeChecker(tabsRole) {
  return element => !!element.type && element.type.tabsRole === tabsRole;
}

export const isTab = makeTypeChecker('Tab');
export const isTabList = makeTypeChecker('TabList');
export const isTabPanel = makeTypeChecker('TabPanel');

function isTabChild(child) {
  return isTab(child) || isTabList(child) || isTabPanel(child);
}

export function deepMap(children, callback) {
  return Children.map(children, child => {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) return null;

    if (isTabChild(child)) {
      return callback(child);
    }

    if (child.props && child.props.children && typeof child.props.children === 'object') {
      // Clone the child that has children and map them too
      return cloneElement(child, {
        ...child.props,
        children: deepMap(child.props.children, callback),
      });
    }

    return child;
  });
}

export function deepForEach(children, callback) {
  return Children.forEach(children, child => {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) return;

    if (isTab(child) || isTabPanel(child)) {
      callback(child);
    } else if (child.props && child.props.children && typeof child.props.children === 'object') {
      if (isTabList(child)) callback(child);
      deepForEach(child.props.children, callback);
    }
  });
}
