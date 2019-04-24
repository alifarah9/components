import React, { Component } from 'react';
import PropTypes from 'prop-types';

let ctrl;

export default class GenericSchemaForm extends Component {
  static propTypes = {
    schema: PropTypes.object, // eslint-disable-line
    model: PropTypes.any, // eslint-disable-line
    errors: PropTypes.any, // eslint-disable-line
    locale: PropTypes.string, // eslint-disable-line
    translations: PropTypes.object, // eslint-disable-line
    onChange: PropTypes.func.isRequired, // eslint-disable-line
  };

  constructor(props) {
    super(props);
    this.state = {};

    ctrl = this;
  }

  onChange(event) {
    // eslint-disable-line
    const isValid = true;
    ctrl.props.onChange(event.target.value, isValid, ctrl.props.schema);
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.onChange} className="form-control" />
      </div>
    );
  }
}
