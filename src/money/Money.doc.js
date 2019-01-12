import React, { Fragment } from 'react';
import Money from '.';

export default {
  title: 'Money',
  tagline: 'Must be funny...',
  detailText: (
    <Fragment>
      Uses{' '}
      <a
        href="https://github.com/transferwise/formatting/"
        target="_blank"
        rel="noopener noreferrer"
      >
        @transferwise/formatting
      </a>{' '}
      and outputs plain text.
    </Fragment>
  ),
  name: 'Money',
  component: Money,
  initialProps: {
    amount: 1234.5678,
    currency: 'GBP',
  },
  levers: [
    {
      type: 'number',
      label: 'Amount',
      prop: 'amount',
    },
    {
      type: 'text',
      label: 'Currency',
      prop: 'currency',
    },
  ],
};
