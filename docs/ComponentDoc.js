import React, { Component } from 'react';
import Types from 'prop-types';

export default class ComponentDoc extends Component {
  static propTypes = {
    title: Types.node.isRequired,
    tagline: Types.node.isRequired,
    component: Types.func.isRequired,
    detailText: Types.node,
    name: Types.string.isRequired,
    initialProps: Types.object, // eslint-disable-line react/forbid-prop-types
    levers: Types.arrayOf(
      Types.shape({
        type: Types.oneOf(['number', 'text']).isRequired,
        label: Types.string.isRequired,
        prop: Types.string,
      }),
    ),
  };

  static defaultProps = {
    detailText: '',
    initialProps: {},
    levers: [],
  };

  constructor(props) {
    super(props);
    this.state = { componentProps: props.initialProps };
  }

  renderCode() {
    const { name } = this.props;
    const { componentProps } = this.state;
    return `<${name}
${Object.keys(componentProps)
      .map(key => `  ${key}={${JSON.stringify(componentProps[key])}}`)
      .join('\n')} />`;
  }

  renderLever = ({ label, prop, type }, index) => {
    const { name } = this.props;
    const { componentProps } = this.state;
    const id = `${name}-lever-${index}`;
    // TODO: add separate area for documenting the prop types of a component
    return (
      <div className={`col-xs-12 ${index !== 0 ? 'm-t-3' : ''}`} key={id}>
        <label htmlFor={`${id}-input`} className="control-label">
          {label}
        </label>
        <input
          id={`${id}-input`}
          type={type}
          value={componentProps[prop]}
          onChange={event => {
            const {
              target: { value },
            } = event;
            this.setState(oldProps => ({
              componentProps: {
                ...oldProps.componentProps,
                [prop]: type === 'number' ? parseFloat(value) : value,
              },
            }));
          }}
          className="form-control"
        />
      </div>
    );
  };

  render() {
    const { title, tagline, detailText, levers, component: DocumentedComponent } = this.props;
    const { componentProps } = this.state;
    return (
      <div className="container" id="money">
        <div className="section">
          <div className="row">
            <div className="col-md-6">
              <h2>{title}</h2>
              <p>{tagline}</p>
              <pre className="tw-docs-code">{this.renderCode()}</pre>
              {detailText}
            </div>
            <div className="col-md-6">
              <div>
                <DocumentedComponent {...componentProps} />
              </div>
              <div className="m-t-4 row">{levers.map(this.renderLever)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
