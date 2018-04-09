import React from 'react';
import { shallow } from 'enzyme';

import { Select, MoneyInput } from '../';

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
});
