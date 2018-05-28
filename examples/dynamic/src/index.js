import 'babel-polyfill';
import 'url-polyfill';
import React from 'react';
import app from './common/app';
import routers from './common/router';
import {connect} from 'redva';
import { routerRedux,Router, Route, Switch, Redirect } from 'redva/router';

class Naviagtion extends React.PureComponent{
  constructor(props){
    super(props);
  }
  next(url){
    this.props.dispatch(routerRedux.replace(url))
  }
  render(){
    return(
      <div style={{ marginBottom: '50px' }}>
        导航栏:
        {routers.map(router => (
          <div key={router.url} style={{color:'blue',textDecoration:'underline',cursor:'pointer'}} onClick={this.next.bind(this,router.url)}>
            {router.name}
          </div>
        ))}
      </div>
    );
  }
}

let NaviagtionConnect = connect()(Naviagtion)

app.router(({ history, app }) => {
  return (
    <Router history={history}>
      <div>
        <NaviagtionConnect/>
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
    </Router>
  );
});

app.start('#root');
