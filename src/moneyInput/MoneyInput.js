import React, { Component } from 'react';
import Types from 'prop-types';
import Select from '../select';

import { formatNumber, parseNumber } from './numberFormatting';

const Currency = Types.shape({
  header: Types.string,
  value: Types.string,
  label: Types.string,
  currency: Types.string,
  note: Types.string,
  searchable: Types.string,
});

class MoneyInput extends Component {
  static propTypes = {
    id: Types.string,
    currencies: Types.arrayOf(Currency).isRequired,
    selectedCurrency: Currency.isRequired,
    onCurrencyChange: Types.func.isRequired,
    amount: Types.number.isRequired,
    size: Types.oneOf(['sm', 'md', 'lg']),
    onAmountChange: Types.func.isRequired,
    numberFormatLocale: Types.string,
    numberFormatPrecision: Types.number,
  };

  static defaultProps = {
    id: undefined,
    size: 'lg',
    numberFormatLocale: 'en-GB',
    numberFormatPrecision: 2,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      formattedAmount: formatNumber(
        props.amount,
        props.numberFormatLocale,
        props.numberFormatPrecision,
      ),
      amountFocused: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.amountFocused) {
      this.setState({
        formattedAmount: formatNumber(
          nextProps.amount,
          nextProps.numberFormatLocale,
          nextProps.numberFormatPrecision,
        ),
      });
    }
  }

  onAmountChange = event => {
    const { value } = event.target;
    this.setState({
      formattedAmount: value,
    });
    const parsed = parseNumber(
      value,
      this.props.numberFormatLocale,
      this.props.numberFormatPrecision,
    );
    if (!Number.isNaN(parsed)) {
      this.props.onAmountChange(parsed);
    }
  };

  onAmountBlur = () => {
    this.amountFocused = false;
    this.formatAmount();
  };

  onAmountFocus = () => {
    this.amountFocused = true;
  };

  getSelectOptions() {
    const headerMapping = this.props.currencies.reduce(
      (accumulator, option) => {
        if (option.header) {
          accumulator.currentHeader = option.header; // eslint-disable-line no-param-reassign
        } else if (option.value) {
          accumulator.mapping[option.value] = // eslint-disable-line no-param-reassign
            accumulator.currentHeader;
        }
        return accumulator;
      },
      { currentHeader: null, mapping: {} },
    ).mapping;

    const foundOptions = this.props.currencies.filter(option =>
      this.includeCurrencyInSearchResults(option),
    );

    return this.props.currencies.filter(option => {
      if (option.header) {
        return foundOptions.reduce(
          (headerVisible, foundOption) =>
            headerVisible || headerMapping[foundOption.value] === option.header,
          false,
        );
      }
      return foundOptions.indexOf(option) !== -1;
    });
  }

  formatAmount() {
    this.setState(previousState => {
      const parsed = parseNumber(
        previousState.formattedAmount,
        this.props.numberFormatLocale,
        this.props.numberFormatPrecision,
      );
      if (Number.isNaN(parsed)) {
        return {
          formattedAmount: previousState.formattedAmount,
        };
      }
      return {
        formattedAmount: formatNumber(
          parsed,
          this.props.numberFormatLocale,
          this.props.numberFormatPrecision,
        ),
      };
    });
  }

  includeCurrencyInSearchResults(currency) {
    const searchQuery = this.state.searchQuery.toLowerCase();
    return (
      currency.label &&
      (currency.label.toLowerCase().indexOf(searchQuery) !== -1 ||
        (currency.searchable && currency.searchable.toLowerCase().indexOf(searchQuery) !== -1) ||
        (currency.note && currency.note.toLowerCase().indexOf(searchQuery) !== -1))
    );
  }

  render() {
    const { selectedCurrency, onCurrencyChange, size } = this.props;
    // TODO: amount handling
    return (
      <div className={`input-group input-group-${size}`}>
        <input
          id={this.props.id}
          value={this.state.formattedAmount}
          type="text"
          className="form-control"
          onChange={this.onAmountChange}
          onFocus={this.onAmountFocus}
          onBlur={this.onAmountBlur}
        />
        <span className="input-group-btn amount-currency-select-btn">
          <Select
            options={this.getSelectOptions()}
            selected={{ ...selectedCurrency, note: null }}
            onChange={onCurrencyChange}
            onSearchChange={searchQuery => this.setState({ searchQuery })}
            searchValue={this.state.searchQuery}
            size={size}
            required
            dropdownRight="xs"
            dropdownWidth="lg"
            inverse
          />
        </span>
      </div>
    );
  }
}

export default MoneyInput;
