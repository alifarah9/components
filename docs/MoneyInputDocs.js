import React, { Component } from 'react';
import { MoneyInput, Select } from '../src';

const currencies = [
  {
    header: 'Popular currencies',
  },
  {
    value: 'EUR',
    label: 'EUR',
    note: 'Euro',
    currency: 'eur',
    searchable: 'Spain, Germany, France, Austria, Estonia',
  },
  {
    value: 'USD',
    label: 'USD',
    note: 'United States Dollar',
    currency: 'usd',
    searchable: 'Hong Kong, Saudi Arabia',
  },
  {
    value: 'GBP',
    label: 'GBP',
    note: 'Great British Pound',
    currency: 'gbp',
    searchable: 'England, Scotland, Wales',
  },
  {
    header: 'Some other currencies',
  },
  {
    value: 'CAD',
    label: 'CAD',
    note: 'Canada Dollar',
    currency: 'cad',
  },
  {
    value: 'AUD',
    label: 'AUD',
    note: 'Australia Dollar',
    currency: 'aud',
  },
];

export default class MoneyInputDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCurrency: currencies[1],
      amount: 1000,
    };
  }

  render() {
    return (
      <div className="container">
        <section className="section">
          <div className="row">
            <div className="col-md-6">
              <h2>Money Input</h2>
              <p>Cash makes the world go round</p>
            </div>
            <div className="col-md-6">
              <MoneyInput
                currencies={currencies}
                amount={this.state.amount}
                size={this.state.size}
                onAmountChange={amount => this.setState({ amount })}
                selectedCurrency={this.state.selectedCurrency}
                onCurrencyChange={selectedCurrency => this.setState({ selectedCurrency })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable react/jsx-indent */}
              <pre className="tw-docs-code">
                {`<MoneyInput
  amount={${this.state.amount}}
  onAmountChange={[a function]}
  onCurrencyChange={[a function]}
  size={${this.state.size ? `"${this.state.size}"` : undefined}}
  selectedCurrency={${
    this.state.selectedCurrency ? JSON.stringify(this.state.selectedCurrency, null, '  ') : null
  }}
  currencies={${JSON.stringify(currencies, null, '  ')}}
  />
`}
              </pre>
              {/* eslint-enable react/jsx-indent */}
            </div>
            <div className="col-md-6">
              <label htmlFor="size-selector" className="control-label">
                Size
              </label>
              <Select
                id="size-selector"
                selected={
                  this.state.size ? { value: this.state.size, label: this.state.size } : undefined
                }
                options={['sm', 'md', 'lg'].map(size => ({ value: size, label: size }))}
                onChange={selection =>
                  this.setState({ size: selection ? selection.value : undefined })
                }
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
