import invariant from 'invariant';
import checkModel from './checkModel';
import prefixNamespace from './prefixNamespace';
import Plugin, { filterHooks } from './Plugin';
import createStore from './createStore';
import getAction from './getAction';
import getMutation from './getMutation';
import createAsyncMiddleware from './createAsyncMiddleware';
import createImmerReducer, { combineReducers } from './createImmerReducer';
import {
  run as runSubscription,
  unlisten as unlistenSubscription,
} from './subscription';
import { noop } from './utils';

// Internal model to update global state when do unmodel
const redvaModel = {
  namespace: '@@redva',
  state: 0,
  mutations: {
    UPDATE(state) {
      state += 1;
    },
  },
};

/**
 * Create dva-core instance.
 *
 * @param hooksAndOpts
 * @param createOpts
 */
export function create(hooksAndOpts = {}, createOpts = {}) {
  const { initialReducer, setupApp = noop } = createOpts;

  const plugin = new Plugin();
  plugin.use(filterHooks(hooksAndOpts));

  const app = {
    _models: [prefixNamespace({ ...redvaModel })],
    _store: null,
    _plugin: plugin,
    use: plugin.use.bind(plugin),
    model,
    start,
  };
  return app;

  /**
   * Register model before app is started.
   *
   * @param m {Object} model to register
   */
  function model(m) {
    if (process.env.NODE_ENV !== 'production') {
      checkModel(m, app._models);
    }
    const prefixedModel = prefixNamespace({ ...m });
    app._models.push(prefixedModel);
    return prefixedModel;
  }

  /**
   * Inject model after app is started.
   *
   * @param createReducer
   * @param onError
   * @param unlisteners
   * @param m
   */
  function injectModel(createReducer, actions, onError, unlisteners, m) {
    m = model(m);

    const store = app._store;
    const onMutation = plugin.get('onMutation');
    store.asyncReducers[m.namespace] = {
      mutations: getMutation(m.mutations, onMutation, m),
      state: m.state,
    };
    store.replaceReducer(createReducer(store.asyncReducers));
    if (m.actions) {
      actions[m.namespace] = app._getAction(
        m.actions,
        m,
        onError,
        plugin.get('onAction')
      );
      store.runAction(actions);
    }
    if (m.subscriptions) {
      unlisteners[m.namespace] = runSubscription(
        m.subscriptions,
        m,
        app,
        onError
      );
    }
  }

  /**
   * Unregister model.
   *
   * @param createReducer
   * @param reducers
   * @param unlisteners
   * @param namespace
   *
   * Unexpected key warn problem:
   * https://github.com/reactjs/redux/issues/1636
   */
  function unmodel(createReducer, reducers, actions, unlisteners, namespace) {
    const store = app._store;

    // Delete reducers
    delete store.asyncReducers[namespace];
    delete reducers[namespace];
    delete actions[namespace];
    store.replaceReducer(createReducer());
    store.dispatch({ type: '@@redva/UPDATE' });

    //reload actions
    store.runAction(actions);

    // Unlisten subscrioptions
    unlistenSubscription(unlisteners, namespace);

    // Delete model from app._models
    app._models = app._models.filter(model => model.namespace !== namespace);
  }

  /**
   * Start the app.
   *
   * @returns void
   */
  function start() {
    // Global error handler
    const onError = (err, extension) => {
      if (err) {
        if (typeof err === 'string') err = new Error(err);
        err.preventDefault = () => {
          err._dontReject = true;
        };
        plugin.apply('onError', err => {
          throw new Error(err.stack || err);
        })(err, app._store.dispatch, extension);
      }
    };
    let extraModels = plugin.get('extraModels');
    extraModels.forEach(model => {
      app.model(model);
    });

    const asyncMiddleware = createAsyncMiddleware();
    app._getAction = getAction.bind(null);

    let actions = {};
    const onMutation = plugin.get('onMutation');
    const reducers = {};
    for (const m of app._models) {
      reducers[m.namespace] = {
        mutations: getMutation(m.mutations, onMutation, m),
        state: m.state,
      };
      actions[m.namespace] = app._getAction(
        m.actions,
        m,
        onError,
        plugin.get('onAction')
      );
    }

    let extraReducers = {
      ...initialReducer,
      ...plugin.get('extraReducers'),
    };
    invariant(
      Object.keys(extraReducers).every(key => !(key in reducers)),
      `[app.start] extraReducers is conflict with other reducers, reducers list: ${Object.keys(
        reducers
      ).join(', ')}`
    );

    // Create store
    const store = (app._store = createStore({
      // eslint-disable-line
      reducers: createReducer(),
      initialState: hooksAndOpts.initialState || {},
      plugin,
      createOpts,
      asyncMiddleware,
    }));

    // Extend store
    store.runAction = asyncMiddleware.run;
    store.asyncReducers = {};

    // Execute listeners when state is changed
    const listeners = plugin.get('onStateChange');
    for (const listener of listeners) {
      store.subscribe(() => {
        listener(store.getState());
      });
    }

    // Run sagas
    asyncMiddleware.run(actions);

    // Setup app
    setupApp(app);

    // Run subscriptions
    const unlisteners = {};
    for (const model of this._models) {
      if (model.subscriptions) {
        unlisteners[model.namespace] = runSubscription(
          model.subscriptions,
          model,
          app,
          onError
        );
      }
    }

    // Setup app.model and app.unmodel
    app.model = injectModel.bind(
      app,
      createReducer,
      actions,
      onError,
      unlisteners
    );
    app.unmodel = unmodel.bind(
      app,
      createReducer,
      reducers,
      actions,
      unlisteners
    );

    /**
     * Create global reducer for redux.
     *
     * @returns {Object}
     */
    function createReducer() {
      let normalReducers;
      if (Object.keys(extraReducers).length != 0) {
        normalReducers = combineReducers(extraReducers);
      } else {
        normalReducers = (state, action) => state;
      }
      const mutations = createImmerReducer(reducers);
      let asyncMutations;
      if (app._store) {
        asyncMutations = createImmerReducer(app._store.asyncReducers);
      } else {
        asyncMutations = (state, action) => state;
      }
      return (state, action) => {
        state = normalReducers(state, action);
        state = mutations(state, action);
        state = asyncMutations(state, action);
        return state;
      };
    }
  }
}
