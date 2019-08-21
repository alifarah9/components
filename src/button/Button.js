import React from 'react';
import Types from 'prop-types';
import classNames from 'classnames';
import './Button.less';

const Type = {
  PRIMARY: 'primary',
  PAY: 'pay',
  SECONDARY: 'secondary',
  DANGER: 'danger',
};

const Size = {
  EXTRASMALL: 'xs',
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
};

const State = {
  DEFAULT: 'default',
  LOADING: 'loading',
  DISABLED: 'disabled',
};

const Button = ({ label, state, size, type, block, onClick }) => {
  const isDisabled = state === State.DISABLED;
  const isLoading = state === State.LOADING;

  const classes = classNames(`btn btn-${size}`, {
    'btn-loading': isLoading,
    'btn-primary': type === Type.PRIMARY,
    'btn-success': type === Type.PAY,
    'btn-default': type === Type.SECONDARY,
    'btn-danger': type === Type.DANGER,
    'btn-block': block,
  });

  return (
    <button
      type="button"
      className={classes}
      onClick={e => onClick(e)}
      disabled={isDisabled || state === State.LOADING}
    >
      {label}
      {isLoading && <span className={classNames('btn-loader', { 'm-l-2': !block })} />}
    </button>
  );
};

Button.Type = Type;
Button.Size = Size;
Button.State = State;

Button.propTypes = {
  type: Types.oneOf(Object.values(Type)),
  size: Types.oneOf(Object.values(Size)),
  state: Types.oneOf(Object.values(State)),
  block: Types.bool,
  onClick: Types.func.isRequired,
  label: Types.string.isRequired,
};

Button.defaultProps = {
  size: Button.Size.MEDIUM,
  type: Button.Type.PRIMARY,
  state: Button.State.DEFAULT,
  block: false,
};

export default Button;
