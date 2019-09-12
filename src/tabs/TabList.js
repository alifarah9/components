import React from 'react';
import PropTypes from 'prop-types';

const TabList = ({ children, ...attributes }) => {
  return (
    <ul {...attributes} className="tabs__tab-list" role="tablist">
      {children}
    </ul>
  );
};

TabList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

TabList.tabsRole = 'TabList';

export default TabList;
