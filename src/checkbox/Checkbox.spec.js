import React from 'react';
import { shallow } from 'enzyme';

import Checkbox from './';
import CheckboxButton from '../common/CheckboxButton';

describe('Checkbox', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      label: 'hello',
      onChange: jest.fn(),
    };
    component = shallow(<Checkbox {...props} />);
  });

  it('renders the given label', () => {
    expect(component.text()).toContain(props.label);
  });

  it('calls change handler with new checked value when not disabled and checkbox button is clicked', () => {
    const onChange = jest.fn();
    component.setProps({ onChange });

    expect(onChange).not.toBeCalled();
    clickCheckboxButton();
    expect(onChange).toBeCalledWith(true);

    component.setProps({ checked: true });
    clickCheckboxButton();
    expect(onChange).toBeCalledWith(false);
  });

  it('does not call change handler on checkbox button click when disabled', () => {
    const onChange = jest.fn();
    component.setProps({ onChange, disabled: true });

    expect(onChange).not.toBeCalled();
    clickCheckboxButton();
    expect(onChange).not.toBeCalled();
  });

  it('has disabled class when the flag is passed', () => {
    expect(isDisabled()).toBe(false);

    component.setProps({ disabled: true });
    expect(isDisabled()).toBe(true);
  });

  it('has error class and passes it to checkbox button when required and not disabled', () => {
    component.setProps({ disabled: true, required: true });
    expect(hasErrorClass()).toBe(false);
    expect(checkboxButtonHasError()).toBe(false);
    component.setProps({ disabled: false, required: true, checked: true });
    expect(hasErrorClass()).toBe(false);
    expect(checkboxButtonHasError()).toBe(false);

    component.setProps({ disabled: false, required: true, checked: false });
    expect(hasErrorClass()).toBe(true);
    expect(checkboxButtonHasError()).toBe(true);
  });

  it('has an asterisk after the label when required', () => {
    expect(component.text()).not.toContain(`${props.label}*`);
    component.setProps({ required: true });
    expect(component.text()).toContain(`${props.label}*`);
  });

  it('passes checked to checkbox button', () => {
    expect(checkboxButton().prop('checked')).toBe(false);
    component.setProps({ checked: true });
    expect(checkboxButton().prop('checked')).toBe(true);
  });

  it('passes disabled to checkbox button', () => {
    expect(checkboxButton().prop('disabled')).toBe(false);
    component.setProps({ disabled: true });
    expect(checkboxButton().prop('disabled')).toBe(true);
  });

  const isDisabled = () => component.hasClass('disabled');
  const hasErrorClass = () => component.hasClass('has-error');
  const checkboxButton = () => component.find(CheckboxButton);
  const checkboxButtonHasError = () => checkboxButton().hasClass('has-error');

  function clickCheckboxButton() {
    checkboxButton().simulate('click');
  }
});
