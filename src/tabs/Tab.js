import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tab = ({ children, id, disabled, panelId, selected, handleKeyDown, ...attributes }) => {
  const node = useRef(null);

  const checkFocus = () => {
    if (selected && node) {
      node.current.focus();
    }
  };

  useEffect(() => {
    checkFocus();
  });

  return (
    <li
      {...attributes}
      className={classNames('tabs__tab', {
        'tabs__tab--selected': selected,
        'tabs__tab--disabled': disabled,
      })}
      ref={node}
      role="tab"
      id={id}
      aria-selected={selected ? 'true' : 'false'}
      aria-disabled={disabled ? 'true' : 'false'}
      aria-controls={panelId}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      {children}
    </li>
  );
};

Tab.defaultProps = {
  disabled: false,
  selected: false,
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  id: PropTypes.string.isRequired,
  panelId: PropTypes.string.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
};

export default Tab;
