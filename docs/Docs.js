import React, { Fragment } from 'react';
import './Docs.less';

import Header from './Header';
import ComponentDoc from './ComponentDoc';

function importAll(requireModule) {
  return requireModule.keys().map(key => requireModule(key).default);
}

const docModules = importAll(require.context('../src/', true, /\**.*.doc.js$/));

const Docs = () => (
  <Fragment>
    <Header />
    {docModules.map(mod => <ComponentDoc key={mod.name} {...mod} />)}
  </Fragment>
);

export default Docs;
