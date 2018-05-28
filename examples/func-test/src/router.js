import React from 'react';
import { Router, Route, Switch } from 'redva/router';
import IndexPage from './routes/IndexPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" exact={true} component={IndexPage} />
    </Router>
  );
}

export default RouterConfig;
