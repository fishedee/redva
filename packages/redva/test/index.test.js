import expect from 'expect';
import React from 'react';
import redva from '../src/index';

const countModel = {
  namespace: 'count',
  state: 0,
  mutations: {
    add(state, { payload }) {
      state.count += payload || 1;
    },
    minus(state, { payload }) {
      state.count -= -payload || 1;
    },
  },
};

describe('index', () => {
  xit('normal', () => {
    const app = redva();
    app.model({ ...countModel });
    app.router(() => <div />);
    app.start('#root');
  });

  it('start without container', () => {
    const app = redva();
    app.model({ ...countModel });
    app.router(() => <div />);
    app.start();
  });

  it('throw error if no routes defined', () => {
    const app = redva();
    expect(() => {
      app.start();
    }).toThrow(/router must be registered before app.start/);
  });

  it('opts.initialState', () => {
    const app = redva({
      initialState: { count: 1 },
    });
    app.model({ ...countModel });
    app.router(() => <div />);
    app.start();
    expect(app._store.getState().count).toEqual(1);
  });

  it('opts.extraMiddlewares', () => {
    let count;
    const countMiddleware = () => () => () => {
      count += 1;
    };

    const app = redva({
      extraMiddlewares: countMiddleware,
    });
    app.router(() => <div />);
    app.start();

    count = 0;
    app._store.dispatch({ type: 'test' });
    expect(count).toEqual(1);
  });

  it('opts.extraMiddlewares with array', () => {
    let count;
    const countMiddleware = () => next => action => {
      count += 1;
      next(action);
    };
    const count2Middleware = () => next => action => {
      count += 2;
      next(action);
    };

    const app = redva({
      extraMiddlewares: [countMiddleware, count2Middleware],
    });
    app.router(() => <div />);
    app.start();

    count = 0;
    app._store.dispatch({ type: 'test' });
    expect(count).toEqual(3);
  });

  it('opts.extraEnhancers', () => {
    let count = 0;
    const countEnhancer = storeCreator => (
      reducer,
      preloadedState,
      enhancer
    ) => {
      const store = storeCreator(reducer, preloadedState, enhancer);
      const oldDispatch = store.dispatch;
      store.dispatch = action => {
        count += 1;
        oldDispatch(action);
      };
      return store;
    };
    const app = redva({
      extraEnhancers: [countEnhancer],
    });
    app.router(() => <div />);
    app.start();

    app._store.dispatch({ type: 'test' });
    expect(count).toEqual(1);
  });

  it('opts.onStateChange', () => {
    let savedState = null;

    const app = redva({
      onStateChange(state) {
        savedState = state;
      },
    });
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state) {
          state.count += 1;
        },
      },
    });
    app.router(() => <div />);
    app.start();

    app._store.dispatch({ type: 'count/add' });
    expect(savedState.count).toEqual(1);
  });
});
