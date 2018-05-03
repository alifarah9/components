import React from 'react';
import { shallow } from 'enzyme';

import { Select, MoneyInput } from '../';

jest.mock('./numberFormatting', () => ({
  parseNumber: jest.fn(),
  formatNumber: jest.fn(),
}));

const numberFormatting = require('./numberFormatting');

describe('Money Input', () => {
  let component;
  let props;

  beforeEach(() => {
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
    props = {
      currencies,
      selectedCurrency: currencies[1],
      amount: 1000,
      onAmountChange: jest.fn(),
      onCurrencyChange: jest.fn(),
    };
    component = shallow(<MoneyInput {...props} />);
  });

  function currencySelect() {
    return component.find(Select);
  }

  function searchCurrencies(query) {
    currencySelect().prop('onSearchChange')(query);
  }

  function displayedCurrencies() {
    return currencySelect().prop('options');
  }

  function amountInput() {
    return component.find('input');
  }

  function focusAmount() {
    amountInput().simulate('focus');
  }

  function blurAmount() {
    amountInput().simulate('blur');
  }

  function enterAmount(amount) {
    focusAmount();
    amountInput().simulate('change', { target: { value: amount } });
  }

  it('renders a select with all the currencies as options', () => {
    expect(currencySelect().length).toBe(1);
    expect(displayedCurrencies()).toEqual(props.currencies);
  });

  it('shows the currently active currency as active and hides its note', () => {
    expect(currencySelect().prop('selected')).toEqual({
      value: 'EUR',
      label: 'EUR',
      note: null,
      currency: 'eur',
      searchable: 'Spain, Germany, France, Austria, Estonia',
    });
  });

  it('calls onCurrencyChange when the user selects a different currency', () => {
    expect(props.onCurrencyChange).not.toHaveBeenCalled();
    currencySelect().prop('onChange')(props.currencies[2]);
    expect(props.onCurrencyChange).toHaveBeenCalledTimes(1);
    expect(props.onCurrencyChange).toHaveBeenLastCalledWith(props.currencies[2]);
  });

  it('can be different sizes and defaults to lg', () => {
    expect(component.find('.input-group').hasClass('input-group-lg')).toBe(true);
    expect(currencySelect().prop('size')).toBe('lg');
    ['sm', 'md', 'lg'].forEach(size => {
      component.setProps({ size });
      expect(currencySelect().prop('size')).toBe(size);
      expect(component.find('.input-group').hasClass(`input-group-${size}`)).toBe(true);
    });
  });

  it('configures the select visually correctly', () => {
    const options = currencySelect().props();
    expect(options.required).toBe(true);
    expect(options.dropdownRight).toBe('xs');
    expect(options.dropdownWidth).toBe('lg');
    expect(options.inverse).toBe(true);
  });

  describe('when searching', () => {
    let testCurrencies;

    beforeEach(() => {
      testCurrencies = [
        {
          header: 'group 1',
        },
        {
          value: 'value-xYz',
          label: 'label-xYz',
          note: 'note-xYz',
          currency: 'currency-xYz',
          searchable: 'searchable-xYz',
        },
        {
          value: 'value-QwE',
          label: 'label-QwE',
          note: 'note-QwE',
          currency: 'currency-QwE',
          searchable: 'searchable-QwE',
        },
        {
          header: 'group 2',
        },
        {
          value: 'value-[];',
          label: 'label-[];',
          note: 'note-[];',
          currency: 'currency-[];',
          searchable: 'searchable-[];',
        },
        {
          value: 'value-+=}',
          label: 'label-+=}',
          note: 'note-+=}',
          currency: 'currency-+=}',
          searchable: 'searchable-+=}',
        },
      ];
    });

    function filterPropertiesBesides(obj, property) {
      return Object.keys(obj).reduce((filtered, currentKey, index) => {
        if (currentKey !== property) {
          obj[currentKey] = `${index}`; // eslint-disable-line no-param-reassign
        }
        return obj;
      }, obj);
    }

    function notHeader(option) {
      return !option.header;
    }

    it('passes the search value to the selector', () => {
      expect(currencySelect().prop('searchValue')).toBe('');
      searchCurrencies('hello?');
      expect(currencySelect().prop('searchValue')).toBe('hello?');
    });

    it('hides elements where the label does not match', () => {
      const currencies = testCurrencies
        .filter(notHeader)
        .map(currency => filterPropertiesBesides(currency, 'label'));
      component.setProps({
        currencies,
      });
      expect(displayedCurrencies()).toEqual(currencies);
      searchCurrencies('Xy');
      expect(displayedCurrencies()).toEqual([currencies[0]]);
    });

    it('hides elements where the note does not match', () => {
      const currencies = testCurrencies
        .filter(notHeader)
        .map(currency => filterPropertiesBesides(currency, 'note'));
      component.setProps({
        currencies,
      });
      expect(displayedCurrencies()).toEqual(currencies);
      searchCurrencies('[]');
      expect(displayedCurrencies()).toEqual([currencies[2]]);
    });

    it('hides elements where the searchable does not match', () => {
      const currencies = testCurrencies
        .filter(notHeader)
        .map(currency => filterPropertiesBesides(currency, 'searchable'));
      component.setProps({
        currencies,
      });
      expect(displayedCurrencies()).toEqual(currencies);
      searchCurrencies('=}');
      expect(displayedCurrencies()).toEqual([currencies[3]]);
    });

    it('displayes header for the group that search results reside in', () => {
      const currencies = testCurrencies;
      component.setProps({ currencies });
      expect(displayedCurrencies()).toEqual(currencies);
      searchCurrencies('=}');
      expect(displayedCurrencies()).toEqual([
        currencies[3], // header
        currencies[5],
      ]);
    });
  });

  it('formats the amount passed in', () => {
    numberFormatting.formatNumber = jest.fn(
      (num, locale, precision) => `formatted ${num}, ${locale}, ${precision}`,
    );
    component.setProps({ amount: 123, numberFormatLocale: 'et-EE', numberFormatPrecision: 3 });
    expect(amountInput().prop('value')).toBe('formatted 123, et-EE, 3');
  });

  it('formats the number you input after you blur it', () => {
    numberFormatting.formatNumber = jest.fn(
      (num, locale, precision) => `formatted ${num}, ${locale}, ${precision}`,
    );
    component.setProps({ numberFormatLocale: 'en-US', numberFormatPrecision: 3 });
    numberFormatting.parseNumber = jest.fn(parseFloat);
    enterAmount('123.45');
    expect(amountInput().prop('value')).toBe('123.45');
    blurAmount();
    expect(amountInput().prop('value')).toBe('formatted 123.45, en-US, 3');
  });

  it('parses the number you input and calls onAmountChange with it', () => {
    const onAmountChange = jest.fn();
    let assertions = 0;
    component.setProps({ onAmountChange, numberFormatLocale: 'es-ES', numberFormatPrecision: 1 });
    numberFormatting.parseNumber = jest.fn((amount, locale, precision) => {
      expect(amount).toBe('500.1234');
      expect(locale).toBe('es-ES');
      expect(precision).toBe(1);
      assertions += 1;
      return 500.1;
    });
    expect(onAmountChange).not.toHaveBeenCalled();
    enterAmount('500.1234');
    expect(onAmountChange).toHaveBeenCalledTimes(1);
    expect(onAmountChange).toHaveBeenLastCalledWith(500.1);
    expect(assertions).toEqual(1);
  });

  it('does not call onAmountChange with a parsed number if unable to parse', () => {
    const onAmountChange = jest.fn();
    component.setProps({ onAmountChange });
    numberFormatting.parseNumber = jest.fn(() => NaN);
    enterAmount('cannot parse this yo');
    expect(onAmountChange).not.toHaveBeenCalled();
  });

  it('passes the id given to the input element', () => {
    expect(amountInput().prop('id')).toBeUndefined();
    component.setProps({ id: 'some-id' });
    expect(amountInput().prop('id')).toBe('some-id');
  });
});
