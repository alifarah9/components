import React, { Component } from 'react';
import Types from 'prop-types';
import Select from '../select';
import './MoneyInput.less';

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
    onCurrencyChange: Types.func,
    amount: Types.number.isRequired,
    size: Types.oneOf(['sm', 'md', 'lg']),
    onAmountChange: Types.func,
    locale: Types.string,
    numberFormatPrecision: Types.number,
    addon: Types.node,
    searchPlaceholder: Types.string,
  };

  static defaultProps = {
    id: null,
    size: 'lg',
    locale: 'en-GB',
    numberFormatPrecision: 2,
    addon: null,
    searchPlaceholder: '',
    onCurrencyChange: null,
    onAmountChange: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      formattedAmount: formatNumber(props.amount, props.locale, props.numberFormatPrecision),
      amountFocused: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.amountFocused) {
      this.setState({
        formattedAmount: formatNumber(
          nextProps.amount,
          nextProps.locale,
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
    const parsed = parseNumber(value, this.props.locale, this.props.numberFormatPrecision);
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
        this.props.locale,
        this.props.numberFormatPrecision,
      );
      if (Number.isNaN(parsed)) {
        return {
          formattedAmount: previousState.formattedAmount,
        };
      }
      return {
        formattedAmount: formatNumber(parsed, this.props.locale, this.props.numberFormatPrecision),
      };
    });
  }

  includeCurrencyInSearchResults(currency) {
    const searchQuery = this.state.searchQuery.toLowerCase();
    return (
      !searchQuery ||
      (currency.label &&
        (currency.label.toLowerCase().indexOf(searchQuery) !== -1 ||
          (currency.searchable && currency.searchable.toLowerCase().indexOf(searchQuery) !== -1) ||
          (currency.note && currency.note.toLowerCase().indexOf(searchQuery) !== -1)))
    );
  }

  render() {
    const { selectedCurrency, onCurrencyChange, size, addon } = this.props;
    const selectOptions = this.getSelectOptions();
    const isFixedCurrency =
      (selectOptions.length === 1 && selectOptions[0].currency === selectedCurrency.currency) ||
      !onCurrencyChange;
    const disabled = !this.props.onAmountChange;
    return (
      <div className={`tw-money-input input-group input-group-${size}`}>
        <input
          id={this.props.id}
          value={this.state.formattedAmount}
          type="text"
          className="form-control"
          onChange={this.onAmountChange}
          onFocus={this.onAmountFocus}
          onBlur={this.onAmountBlur}
          disabled={disabled}
        />
        {addon && (
          <span
            className={`input-group-addon input-${size} ${
              disabled ? 'tw-money-input--disabled' : ''
            }`}
          >
            {addon}
          </span>
        )}
        {isFixedCurrency ? (
          <div
            className={`input-group-addon input-${size} tw-money-input__fixed-currency ${
              disabled ? 'tw-money-input--disabled' : ''
            }`}
          >
            {size === 'lg'
              ? [
                <i className="tw-money-input__keyline" key="keyline" />,
                <i
                  className={`currency-flag currency-flag-${selectedCurrency.currency.toLowerCase()} hidden-xs m-r-2`}
                  key="flag"
                />,
                ]
              : ''}
            <span className={size === 'lg' ? 'm-r-1' : ''}>
              {selectedCurrency.currency.toUpperCase()}
            </span>
          </div>
        ) : (
          <span className="input-group-btn amount-currency-select-btn">
            <Select
              options={selectOptions}
              selected={{ ...selectedCurrency, note: null }}
              onChange={onCurrencyChange}
              searchPlaceholder={this.props.searchPlaceholder}
              onSearchChange={searchQuery => this.setState({ searchQuery })}
              searchValue={this.state.searchQuery}
              size={size}
              required
              dropdownRight="xs"
              dropdownWidth="lg"
              inverse
            />
          </span>
        )}
      </div>
    );
  }
}

export default MoneyInput;
