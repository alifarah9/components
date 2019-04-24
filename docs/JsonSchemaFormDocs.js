import React, { Component } from 'react';
import { JsonSchemaForm } from '../src';

export default class JsonSchemaFormDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: { type: 'string' },
      // model: {},
      // errors: {},
    };
  }

  onChange(model) {
    // eslint-disable-line
    console.log('model', model); // eslint-disable-line
  }

  render() {
    const docsCode = `<JsonSchemaForm
  schema={${this.state.schema}}
/>`;

    return (
      <div className="container">
        <section className="section">
          <div className="row">
            <div className="col-md-6">
              <h2>JSON Schema Form</h2>
              <p>Dynamic</p>
            </div>
            <div className="col-md-6 p-b-2 text-xs-center">
              <JsonSchemaForm schema={this.state.schema} onChange={this.onChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable react/jsx-indent */}
              <pre className="tw-docs-code">{docsCode}</pre>
              {/* eslint-enable react/jsx-indent */}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
