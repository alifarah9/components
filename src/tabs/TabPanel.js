import PropTypes from 'prop-types';
import React from 'react';

const TabPanel = ({ children, id, tabId, ...attributes }) => {
  return (
    <div {...attributes} className="tabs__panel" role="tabpanel" id={id} aria-labelledby={tabId}>
      {children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
};

TabPanel.tabsRole = 'TabPanel';

export default TabPanel;
