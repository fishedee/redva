# API

[以中文版查看此文](./API_zh-CN.md)

## Export Files
### redva

Default export file.

### redva/router

Export the api of [react-router@4.x](https://github.com/ReactTraining/react-router), and also export [react-router-redux](https://github.com/reactjs/react-router-redux) with the `routerRedux` key.

e.g.

```js
import { Router, Route, routerRedux } from 'redva/router';
```

### redva/fetch

Async request library, export the api of [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch). It's just for convenience, you can choose other libraries for free.

### redva/dynamic

Util method to load React Component and redva model dynamically.

e.g.

```js
import dynamic from 'redva/dynamic';

const UserPageComponent = dynamic({
  app,
  models: () => [
    import('./models/users'),
  ],
  component: () => import('./routes/UserPage'),
});
```

`opts` include:

* app: redva instance
* models: function which return promise, and the promise return redva model
* component：function which return promise, and the promise return React Component

## redva API
### `app = redva(opts)`

Create app, and return redva instance. (Notice: redva support multiple instances.)

`opts` includes:

* `history`: Specify the history for router, default `hashHistory`
* `initialState`: Specify the initial state, default `{}`, it's priority is higher then model state

e.g. use `browserHistory`:

```js
import createHistory from 'history/createBrowserHistory';
const app = redva({
  history: createHistory(),
});
```

Besides, for convenience, we can configure [hooks](#appusehooks) in `opts`, like this:

```js
const app = redva({
  history,
  initialState,
  onError,
  onAction,
  onStateChange,
  onMutation,
  extraMiddlewares,
  extraReducers,
  extraEnhancers,
});
```

### `app.use(hooks)`

Specify hooks or register plugin. (Plugin return hooks finally.)

e.g. register [redva-loading](https://github.com/fishedee/redva) plugin:

```js
import createLoading from 'redva-loading';
...
app.use(createLoading(opts));
```

`hooks` includes:

#### `onError((err, dispatch) => {})`

Triggered when `action` has error or `subscription` throw error with `done`. Used for managing global error.

Notice: `subscription`'s error must be throw with the send argument `done`. e.g.

```js
app.model({
  subscriptions: {
    setup({ dispatch }, done) {
      done(e);
    },
  },
});
```

If we are using antd, the most simple error handle would be like this:

```js
import { message } from 'antd';
const app = redva({
  onError(e) {
    message.error(e.message, /* duration */3);
  },
});
```

#### `onAction(fn | fn[])`

Triggered when async action is dispatched. Used for register redux middleware.

#### `onStateChange(fn)`

Triggered when `state` changes. Used for sync `state` to localStorage or server and so on.

#### `onMutation(fn)`

Wrap mutation execute.

#### `extraMiddlewares`

Specify extra middlewares.

e.g. use [redux-logger](https://github.com/evgenyrodionov/redux-logger) to log actions:

```js
import createLogger from 'redux-logger';
const app = redva({
  extraMiddlewares: createLogger(opts),
});
```

#### `extraReducers`

Specify extra reducers.

e.g. [redux-form](https://github.com/erikras/redux-form) needs extra `form` reducer:

```js
import { reducer as formReducer } from 'redux-form'
const app = redva({
  extraReducers: {
    form: formReducer,
  },
});
```

#### `extraEnhancers`

Specify extra [StoreEnhancer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer)s.

e.g. use redva with [redux-persist](https://github.com/rt2zz/redux-persist):

```js
import { persistStore, autoRehydrate } from 'redux-persist';
const app = redva({
  extraEnhancers: [autoRehydrate()],
});
persistStore(app._store);
```

### `app.model(model)`

Register model, view [#Model](#model)  for details.

### `app.unmodel(namespace)`

Unregister model.

### `app.router(({ history, app }) => RouterConfig)`

Register router config.

e.g.

```js
import { Router, Route } from 'redva/router';
app.router(({ history }) => {
  return (
    <Router history={history}>
      <Route path="/" component={App} />
    <Router>
  );
});
```

Recommend using separate file to config router. 

```js
app.router(require('./router'));
```

Besides, if don't need router, like multiple-page application, react-native, we can pass in a function which return JSX Element. e.g.

```js
app.router(() => <App />);
```

### `app.start(selector?)`

Start application. `selector` is optionally, if no `selector`, it will return a function which return JSX element.

```js
app.start('#root');
```

e.g. implement i18n with react-intl:

```js
import { IntlProvider } from 'react-intl';
...
const App = app.start();
ReactDOM.render(<IntlProvider><App /></IntlProvider>, htmlElement);
```

## Model
model is the most important concept in redva.

e.g.

```js
app.model({
  namespace: 'todo',
	state: [],
  mutations: {
    add(state, { payload: todo }) {
      state.todo.push(todo);
    },
  },
  actions: {
    async save({ payload: todo }, { dispatch }) {
      // Call saveTodoToServer, then trigger `add` action to save data
      await saveTodoToServer(todo);
      await dispatch({ type: 'add', payload: todo });
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({ type: 'load' });
        }
      });
    },
  },
});
```

model includes 5 properties:

### namespace

model's namespace.

### state

models's initial state, it's priority is lower then `opts.initialState` in `redva()`.

e.g.

```
const app = redva({
  initialState: { count: 1 },
});
app.model({
  namespace: 'count',
  state: 0,
});
```

Then, state.count is 1 after `app.start()`.

### mutations

Store mutations in key/value Object. mutations is the only place to modify `state`. Triggered by `action`.

`(state, action)`

### actions

Store async actions in key/value Object. Used for do async operations and biz logic, don't modify `state` directly. Triggered by `action`, could trigger new `action`, communicate with server, select data from global `state` and so on.

`async (action, {dispatch,getState}) => void`

### subscriptions

Store subscriptions in key/value Object. Subscription is used for subscribing data source, then trigger action by need. It's executed when `app.start()`.

`({ dispatch, history }, done) => unlistenFunction`

Notice: if we want to unregister a model with `app.unmodel()`, it's subscriptions must return unsubscribe method.
