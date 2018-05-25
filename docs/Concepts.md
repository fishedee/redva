# Concepts

[以中文版查看此文](./Concepts_zh-CN.md)

## Data Flow

<img src="https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png" width="807" />

## Models

### State

`type State = any`

The state tree of your models. Usually, the state is a javascript object(Technically it can be any type), which is a immutable data.

In redva, you can access top state tree data by `_store`.

```javascript
const app = redva();
console.log(app._store); // top state
```

### Action

`type AsyncAction = any`

Just like Redux's Action, in redva, action is a plain object that represents an intention to change the state. Actions are the only way to get data into the store. Any data, whether from UI events, network callbacks, or other sources such as WebSockets needs to eventually be dispatched as actions.action.(ps:dispatch is realized through props by connecting components.)

```javascript
dispatch({
  type: 'add',
});
```

### dispatch function

`type dispatch = (a: Action) => Action`

A dispatching function (or simply dispatch function) is a function that accepts an action or an async action; it then may or may not dispatch one or more actions to the store.

Dispatching function is a function for triggering action, action is the only way to change state, but it just describes an action. while dispatch can be regarded as a way to trigger this action, and Mutation is to describe how to change state.

```javascript
dispatch({
  type: 'user/add', // if in model outside, need to add namespace
  payload: {},
});
```

### Mutation

`type Mutation<S, A> = (state: S, action: A)`

Just like Vuex's Mutation, a mutation (also called a mutation function) is a function that accepts an accumulation and a value .

### Actions

In redva, we use [async/await](http://babeljs.io/docs/plugins/syntax-async-functions) to control asynchronous flow.
You can learn more in [ES6](http://babeljs.io/).

In our applications, the most well-known action is asynchronous operation, it comes from the conception of functional programing.

### Subscription

Subscriptions is a way to get data from source, it is come from elm.

Data source can be: the current time, the websocket connection of server, keyboard input, geolocation change, history router change, etc..

```javascript
import key from 'keymaster';
...
app.model({
  namespace: 'count',
  subscriptions: {
    keyEvent(dispatch) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  }
});
```

## Router

Hereby router usually means frontend router. Because our current app is single page app, frontend codes are required to control the router logics. Through History API provided by the browser, we can monitor the change of the browser's url, so as to control the router.

redva provide `router` function to control router, based on [react-router](https://github.com/reactjs/react-router)。

```javascript
import { Router, Route } from 'redva/router';
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);
```

## Route Components

In redva, we restrict container components to route components, because we use page dimension to design container components.

therefore, almost all connected model components are route components, route components in `/routes/` directory, presentational Components in `/components/` directory.

## References

- [redux docs](http://redux.js.org/docs/Glossary.html)
- [es6](http://babeljs.io/)
- [vuex](https://vuex.vuejs.org/)
- [dva](https://github.com/dvajs/dva)
