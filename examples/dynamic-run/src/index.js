import 'babel-polyfill';
import 'url-polyfill';
import React from 'react';
import app from './common/app';
import routers from './common/router';
import { routerRedux, Route, Switch, Redirect } from 'redva/router';
require.context('./models/', true, /\.js$/);
require.context('./routes/', true, /\.js$/);

const { ConnectedRouter } = routerRedux;

app.router(({ history, app }) => {
  console.log(routers);
  return (
    <ConnectedRouter history={history}>
      <div>
        <div style={{ marginBottom: '50px' }}>
          导航栏:
          {routers.map(router => (
            <div key={router.url}>
              <a href={'#' + router.url}>{router.name}</a>
            </div>
          ))}
        </div>
        <Switch>
          {routers.map(router => (
            <Route
              exact={true}
              key={router.url}
              path={router.url}
              component={router.component}
            />
          ))}
          <Redirect exact={true} from="/" to="/counter" />
        </Switch>
      </div>
    </ConnectedRouter>
  );
});

app.start('#root');
