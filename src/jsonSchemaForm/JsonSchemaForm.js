import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GenericSchemaForm from './genericSchemaForm';

let ctrl;

export default class JsonSchemaForm extends Component {
  static propTypes = {
    schema: PropTypes.object, // eslint-disable-line
    model: PropTypes.any, // eslint-disable-line
    errors: PropTypes.any, // eslint-disable-line
    locale: PropTypes.string,
    translations: PropTypes.object, // eslint-disable-line
    onChange: PropTypes.func.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    locale: 'en-GB',
  };

  constructor(props) {
    super(props);
    this.state = {};

    if (!this.props.schema || !this.props.schema.type) {
      this.props.schema.type = 'number';
    }

    ctrl = this;
  }

  onChange(model) {
    // eslint-disable-line
    ctrl.props.onChange(model);
  }

  render() {
    return (
      <div>
        <GenericSchemaForm
          schema={this.props.schema}
          model={this.props.model}
          errors={this.props.errors}
          locale={this.props.locale}
          translations={this.props.translations}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
