function isNumberLocaleSupported() {
  const number = 1234;
  const numberString = number.toLocaleString && number.toLocaleString('en-GB');
  return numberString === '1,234';
}

export function formatNumber(number, locale = 'en-GB', precision = 2) {
  if (!isNumberLocaleSupported()) {
    return number.toFixed(precision);
  }

  return number.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function parseNumber(num, locale, precision) {
  const number = formatNumber(num, locale, precision);
  const groupSeparator = isNumberLocaleSupported() ? (1000).toLocaleString(locale)[1] : ',';
  const decimalSeparator = isNumberLocaleSupported() ? (1.1).toLocaleString(locale)[1] : '.';
  const trimmedNumber = number.replace(/\s/g, '');
  const numberWithoutGroupSeparator = trimmedNumber.replace(
    new RegExp(`\\${groupSeparator}`, 'g'),
    '',
  );
  const numberWithStandardDecimalSeparator = numberWithoutGroupSeparator.replace(
    new RegExp(`\\${decimalSeparator}`, 'g'),
    '.',
  );
  return parseFloat(parseFloat(numberWithStandardDecimalSeparator).toFixed(precision));
}
