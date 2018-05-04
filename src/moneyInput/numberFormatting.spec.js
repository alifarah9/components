import { formatNumber, parseNumber } from './numberFormatting';

describe('Number formatting', () => {
  const fakeNumber = {
    toLocaleString(locale, options) {
      return `formatted for ${locale} and options ${JSON.stringify(options)}`;
    },

    toFixed(precision) {
      return `fixed for precision ${precision}`;
    },
  };

  it('uses toLocaleString to format if it is supported', () => {
    expect(formatNumber(fakeNumber, 'et-EE', 4)).toBe(
      'formatted for et-EE and options {"minimumFractionDigits":4,"maximumFractionDigits":4}',
    );

    expect(formatNumber(1234.56, 'en-GB', 3)).toBe('1,234.560'); // sanity check
  });

  it('uses toFixed to format if localeString not supported or acts weirdly', () => {
    const toLocaleString = Number.prototype.toLocaleString;
    // eslint-disable-next-line no-extend-native
    Number.prototype.toLocaleString = null;

    expect(formatNumber(fakeNumber, 'en-GB', 5)).toBe('fixed for precision 5');

    // eslint-disable-next-line no-extend-native
    Number.prototype.toLocaleString = () => 'some weird value';

    expect(formatNumber(1234.56, 'en-GB', 3)).toBe('1234.560'); // sanity check

    // eslint-disable-next-line no-extend-native
    Number.prototype.toLocaleString = toLocaleString;
  });

  it('parses localized numbers', () => {
    [['1234.567', 'en-GB', 3], ['1,23,4.567', 'en-US', 3]].forEach(
      ([number, locale, precision]) => {
        expect(parseNumber(number, locale, precision)).toBe(1234.567);
      },
    );
  });
});
