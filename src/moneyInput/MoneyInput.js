import React, { Component } from 'react';
import Types from 'prop-types';
import Select from '../select';

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
    currencies: Types.arrayOf(Currency).isRequired,
    selectedCurrency: Currency.isRequired,
    onCurrencyChange: Types.func.isRequired,
    amount: Types.number.isRequired,
    size: Types.oneOf(['xs', 'sm', 'md', 'lg']),
    onAmountChange: Types.func.isRequired,
  };

  static defaultProps = {
    size: 'lg',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

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
    const { selectedCurrency, amount, onAmountChange, onCurrencyChange, size } = this.props;
    // TODO: amount handling
    return (
      <div className={`input-group input-group-${size}`}>
        <input
          value={amount}
          className="form-control"
          onChange={event => onAmountChange(parseInt(event.target.value, 10))}
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
