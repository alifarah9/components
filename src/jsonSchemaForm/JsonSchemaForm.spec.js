import React from 'react';
import { shallow } from 'enzyme';

import { JsonSchemaForm } from './index';

import { GenericSchemaForm } from './genericSchemaForm/';

console.log(JsonSchemaForm);

describe('Given a component for rendering a JSON schema form', () => {
  let component;
  let props;
  let genericSchemaForm;

  beforeEach(() => {
    const schema = { type: 'number' };
    const model = 2;
    const onChange = jest.fn(),
      props = { schema, model, onChange };
    component = shallow(<JsonSchemaForm {...props} />);

    genericSchemaForm = component.find(GenericSchemaForm);
  });

  describe('when initialised', () => {
    it('should render a generic schema component', () => {
      expect(genericSchemaForm.prop('schema')).toEqual(props.schema);
    });
    it('should pass the generic schema the model', () => {
      expect(genericSchemaForm.prop('model')).toEqual(props.model);
    });
    it('should pass the generic schema the errors', () => {
      expect(genericSchemaForm.prop('errors')).toEqual(props.errors);
    });
    it('should pass the generic schema the translations', () => {
      expect(genericSchemaForm.prop('translations')).toEqual(props.translations);
    });
    it('should pass the generic schema the locale', () => {
      expect(genericSchemaForm.prop('locale')).toEqual(props.locale);
    });
  });

  describe('when the child generic schema triggers onChange', () => {
    let model, isValid, schema;

    beforeEach(() => {
      model = { a: 1 };
      isValid = false;
      schema = { type: 'number' };

      genericSchemaForm.prop('onChange')(model, schema);
    });

    // it('should validate the model', () => {
    //   expect(jsonSchemaValidation.validateSchema.toHaveBeenCalledWith(model, schema);
    // });

    it('should trigger the component onChange', () => {
      expect(props.onChange).toHaveBeenCalledWith(model, isValid, schema);
    });
  });

  // ////// Behaviours ////////

  // Initialisation
  // const props = { model: {}, onChange: jest.fn() };
  // component = shallow(<MyComponent {...props} />); // Does not render child components

  // Change props
  // component.setProps({ model: {a:1} });

  // Simulate DOM input
  // component.find('input').simulate('change', { target: { value: amount } });

  // Trigger child callback
  // component.find(Select).prop('onChange')(newValue);

  // ////// Outcomes ////////

  // Check impact on DOM
  // expect(component.find('.form-group label').text()).toEqual(...)

  // Check if service methods are called
  // jest.mock('./service', () => ({
  //   myMethod: jest.fn()
  // }));
  // const service = require('./service');
  // service.myMethod = jest.fn(() => true);
  // expect(service.myMethod).toHaveBeenCalled();

  // Check if callback was triggered
  // expect(props.onChange).toHaveBeenCalled

  // Check props passed to children
  // expect(component.find(Select).prop('selected')).toEqual(...)
});
