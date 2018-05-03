import React, { Component } from 'react';
import { MoneyInput, Select } from '../src';
import { formatNumber } from '../src/moneyInput/numberFormatting';

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

function formattingWorksWithPrecision(precision) {
  try {
    formatNumber(10, undefined, precision);
    return true;
  } catch (e) {
    return false;
  }
}

function formattingWorksWithLocale(locale) {
  try {
    formatNumber(10, locale);
    return true;
  } catch (e) {
    return false;
  }
}

export default class MoneyInputDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCurrency: currencies[1],
      amount: 1000,
      numberFormatLocale: 'en-GB',
      numberFormatPrecision: 2,
      form: {
        numberFormatLocale: 'en-GB',
        numberFormatPrecision: '2',
        amount: '1000',
      },
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
              <div className={`form-group form-group-${this.state.size || 'lg'}`}>
                <label htmlFor="money-input" className="control-label">
                  How much?
                </label>
                <MoneyInput
                  id="money-input"
                  currencies={currencies}
                  amount={this.state.amount}
                  numberFormatLocale={this.state.numberFormatLocale}
                  numberFormatPrecision={this.state.numberFormatPrecision}
                  size={this.state.size}
                  onAmountChange={amount => this.setState({ amount })}
                  selectedCurrency={this.state.selectedCurrency}
                  onCurrencyChange={selectedCurrency => this.setState({ selectedCurrency })}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable react/jsx-indent */}
              <pre className="tw-docs-code">
                {`<MoneyInput
  amount={${this.state.amount}}
  numberFormatLocale={"${this.state.numberFormatLocale}"}
  numberFormatPrecision={${this.state.numberFormatPrecision}}
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
              <label htmlFor="money-input-size-selector" className="control-label">
                Size
              </label>
              <Select
                id="money-input-size-selector"
                selected={
                  this.state.size ? { value: this.state.size, label: this.state.size } : undefined
                }
                options={['sm', 'md', 'lg'].map(size => ({ value: size, label: size }))}
                onChange={selection =>
                  this.setState({ size: selection ? selection.value : undefined })
                }
              />
              <div className="m-t-3" />
              <label htmlFor="money-input-amount-selector" className="control-label">
                Amount
              </label>
              <input
                id="money-input-amount-selector"
                type="number"
                className="form-control"
                value={this.state.form.amount}
                onChange={event => {
                  const { target: { value: amount } } = event;
                  this.setState(
                    ({ form }) => ({
                      form: { ...form, amount },
                    }),
                    () => {
                      const parsed = parseInt(amount, 10);
                      if (!Number.isNaN(parsed)) {
                        this.setState({ amount: parsed });
                      }
                    },
                  );
                }}
              />
              <div className="m-t-3" />
              <label htmlFor="money-input-number-format-locale-selector" className="control-label">
                Number format locale
              </label>
              <input
                id="money-input-number-format-locale-selector"
                type="text"
                className="form-control"
                value={this.state.form.numberFormatLocale}
                onChange={event => {
                  const { target: { value: numberFormatLocale } } = event;
                  this.setState(
                    ({ form }) => ({
                      form: { ...form, numberFormatLocale },
                    }),
                    () => {
                      if (formattingWorksWithLocale(numberFormatLocale)) {
                        this.setState({ numberFormatLocale });
                      }
                    },
                  );
                }}
              />
              <div className="m-t-3" />
              <label
                htmlFor="money-input-number-format-precision-selector"
                className="control-label"
              >
                Number format precision
              </label>
              <input
                id="money-input-number-format-precision-selector"
                type="number"
                className="form-control"
                value={this.state.form.numberFormatPrecision}
                onChange={event => {
                  const { target: { value: numberFormatPrecision } } = event;
                  this.setState(
                    ({ form }) => ({
                      form: { ...form, numberFormatPrecision },
                    }),
                    () => {
                      const parsed = parseInt(this.state.form.numberFormatPrecision, 10);
                      if (!Number.isNaN(parsed) && formattingWorksWithPrecision(parsed)) {
                        this.setState({ numberFormatPrecision: parsed });
                      }
                    },
                  );
                }}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
