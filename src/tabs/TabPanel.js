import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const TabPanel = ({ children, id, selected, tabId, ...attributes }) => {
  return (
    <div
      {...attributes}
      className={cx('tabs__panel', {
        'tabs__panel--selected': selected,
      })}
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
    >
      {selected ? children : null}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

TabPanel.tabsRole = 'TabPanel';

export default TabPanel;
