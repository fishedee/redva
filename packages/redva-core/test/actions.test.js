import expect from 'expect';
import { create } from '../src/index';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

describe('effects', () => {
  it('dispatch action', done => {
    const app = create();
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch }) {
          await delay(100);
          await dispatch({ type: 'add', payload });
        },
      },
    });
    app.start();
    app._store.dispatch({ type: 'count/addDelay', payload: 2 });
    expect(app._store.getState().count).toEqual(0);
    setTimeout(() => {
      expect(app._store.getState().count).toEqual(2);
      done();
    }, 200);
  });
  it('dispatch action with similar type', async(done) => {
    const app = create();
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch }) {
          await dispatch({ type: 'add', payload });
        },
      },
    });
    app.start();
    expect(app._store.getState().count).toEqual(0);
    
    await app._store.dispatch({ type: 'count/addDelay', payload: 2 });
    await app._store.dispatch({ type: '/count/addDelay', payload: 2 });
    await app._store.dispatch({ type: 'count/addDelay/', payload: 2 });
    await app._store.dispatch({ type: 'count//addDelay', payload: 2 });
    await app._store.dispatch({ type: '/count/add', payload: 2 });
    await app._store.dispatch({ type: 'count/add/', payload: 2 });
    await app._store.dispatch({ type: 'count//add', payload: 2 });
    expect(app._store.getState().count).toEqual(14);
    done();
  });

  it('dispatch action with namespace will get a warning', done => {
    const app = create();
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch }) {
          await delay(100);
          await dispatch({ type: 'add', payload });
        },
      },
    });
    app.start();
    app._store.dispatch({ type: 'count/addDelay', payload: 2 });
    expect(app._store.getState().count).toEqual(0);
    setTimeout(() => {
      expect(app._store.getState().count).toEqual(2);
      done();
    }, 200);
  });

  it('dispatch multi effects in order', done => {
    const app = create();
    app.model({
      namespace: 'counter',
      state: {
        count: 0,
        resolveCount: 0,
      },
      mutations: {
        dump(state, { payload }) {
          for (const i in payload) {
            state.counter[i] = payload[i];
          }
        },
      },
      actions: {
        async changeCountDelay({ payload }, { dispatch }) {
          await delay(200);
          await dispatch({ type: 'dump', payload: { count: payload } });
        },
        async process({ payload }, { dispatch, getState }) {
          await dispatch({ type: 'changeCountDelay', payload });
          const count = getState().counter.count;
          await dispatch({ type: 'dump', payload: { resolveCount: count } });
        },
      },
    });
    app.start();
    app._store.dispatch({ type: 'counter/process', payload: 1 }).then(() => {
      expect(app._store.getState().counter.resolveCount).toEqual(1);
      done();
    });
    expect(app._store.getState().counter.resolveCount).toEqual(0);
  });

  it('getState', done => {
    const app = create();
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch }) {
          await delay(payload.delay || 100);
          await dispatch({ type: 'add', payload: payload.amount });
        },
        async test(action, { dispatch, getState }) {
          await dispatch({ type: 'addDelay', payload: { amount: 2 } });
          const count = getState().count;
          await dispatch({
            type: 'addDelay',
            payload: { amount: count, delay: 0 },
          });
        },
      },
    });
    app.start();
    app._store.dispatch({ type: 'count/test' });
    setTimeout(() => {
      expect(app._store.getState().count).toEqual(4);
      done();
    }, 300);
  });

  it('dispatch action for other models', () => {
    const app = create();
    app.model({
      namespace: 'loading',
      state: false,
      mutations: {
        show(state) {
          state.loading = true;
        },
      },
    });
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async addDelay(_, { dispatch }) {
          await dispatch({ type: 'loading/show' });
        },
      },
    });
    app.start();
    app._store.dispatch({ type: 'count/addDelay' });
    expect(app._store.getState().loading).toEqual(true);
  });

  it('onError', () => {
    const errors = [];
    const app = create({
      onError: (error, dispatch) => {
        error.preventDefault();
        errors.push(error.message);
        dispatch({ type: 'count/add' });
      },
    });
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch }) {
          if (!payload) {
            throw new Error('effect error');
          } else {
            await dispatch({ type: 'add', payload });
          }
        },
      },
    });
    app.start();
    app._store.dispatch({ type: 'count/addDelay' }).then(() => {
      expect(errors).toEqual(['effect error']);
      expect(app._store.getState().count).toEqual(1);
      app._store.dispatch({ type: 'count/addDelay', payload: 2 });
      expect(app._store.getState().count).toEqual(3);
    });
  });

  it('onError: extension', done => {
    const app = create({
      onError(err, dispatch, extension) {
        err.preventDefault();
        dispatch({
          type: 'err/append',
          payload: extension,
        });
      },
    });
    app.model({
      namespace: 'err',
      state: [],
      mutations: {
        append(state, action) {
          state.err.push(action.payload);
        },
      },
      actions: {
        // eslint-disable-next-line
        async generate() {
          throw new Error('Effect error');
        },
      },
    });
    app.start();
    app._store
      .dispatch({
        type: 'err/generate',
        payload: 'err.payload',
      })
      .then(() => {
        expect(app._store.getState().err.length).toEqual(1);
        expect(app._store.getState().err[0].key).toEqual('err/generate');
        expect(app._store.getState().err[0].actionArgs[0].type).toEqual(
          'err/generate'
        );
        expect(app._store.getState().err[0].actionArgs[0].payload).toEqual(
          'err.payload'
        );
        done();
      });
  });

  it('onError in deep action', () => {
    const errors = [];
    const app = create({
      onError: (error, dispatch) => {
        errors.push(error.message);
        dispatch({ type: 'count/add' });
      },
    });
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async throwError() {
          await delay(100);
          throw new Error('effect error');
        },
        async addDelay({ payload }, { dispatch }) {
          await dispatch({ type: 'throwError' });
        },
      },
    });
    app.start();
    app._store
      .dispatch({ type: 'count/addDelay' })
      .then(() => {
        expect(false).toEqual('never should be here');
      })
      .catch(err => {
        expect(err.message).toEqual('effect error');
        expect(errors).toEqual(['effect error']);
        expect(app._store.getState().count).toEqual(1);
      });
  });

  it('onError in deep action and preventDefault', () => {
    const errors = [];
    const app = create({
      onError: (error, dispatch) => {
        error.preventDefault();
        errors.push(error.message);
        dispatch({ type: 'count/add' });
      },
    });
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async throwError() {
          await delay(100);
          throw new Error('effect error');
        },
        async addDelay({ payload }, { dispatch }) {
          await dispatch({ type: 'throwError' });
        },
      },
    });
    app.start();
    app._store
      .dispatch({ type: 'count/addDelay' })
      .then(err => {
        expect(err.message).toEqual('effect error');
        expect(errors).toEqual(['effect error']);
        expect(app._store.getState().count).toEqual(1);
      })
      .catch(() => {
        expect(false).toEqual('never should be here');
      });
  });

  it('onAction', done => {
    const SHOW = '@@LOADING/SHOW';
    const HIDE = '@@LOADING/HIDE';

    const app = create();

    // Test model should be accessible
    let modelNamespace = null;
    // Test onEffect should be run orderly
    let count = 0;
    let expectedKey = null;

    app.use({
      extraReducers: {
        loading(state = false, action) {
          switch (action.type) {
            case SHOW:
              return true;
            case HIDE:
              return false;
            default:
              return state;
          }
        },
      },
      onAction(effect, model, key) {
        expectedKey = key;
        modelNamespace = model.namespace;
        return async function(action, { dispatch }) {
          count *= 2;
          await dispatch({ type: SHOW });
          await effect(...arguments);
          await dispatch({ type: HIDE });
        };
      },
    });

    app.use({
      onAction(effect) {
        return async function(...args) {
          count += 2;
          await effect(...args);
          count += 1;
        };
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
      actions: {
        async addRemote(action, { dispatch }) {
          await delay(100);
          await dispatch({ type: 'add' });
        },
      },
    });

    app.start();

    expect(app._store.getState().loading).toEqual(false);

    app._store.dispatch({ type: 'count/addRemote' });
    expect(app._store.getState().loading).toEqual(true);
    expect(modelNamespace).toEqual('count');
    expect(expectedKey).toEqual('count/addRemote');

    setTimeout(() => {
      expect(app._store.getState().loading).toEqual(false);
      expect(app._store.getState().count).toEqual(1);
      expect(count).toEqual(5);
      done();
    }, 200);
  });

  it('onAction by extraModels', done => {
    const SHOW = 'loading/SHOW';
    const HIDE = 'loading/HIDE';

    const app = create();

    // Test model should be accessible
    let modelNamespace = null;
    // Test onEffect should be run orderly
    let count = 0;
    let expectedKey = null;

    app.use({
      extraModels: {
        namespace: 'loading',
        state: false,
        mutations: {
          SHOW(state, action) {
            state.loading = true;
          },
          HIDE(state, action) {
            state.loading = false;
          },
        },
      },
      onAction(effect, model, key) {
        expectedKey = key;
        modelNamespace = model.namespace;
        return async function(action, { dispatch }) {
          count *= 2;
          await dispatch({ type: SHOW });
          await effect(...arguments);
          await dispatch({ type: HIDE });
        };
      },
    });

    app.use({
      onAction(effect) {
        return async function(...args) {
          count += 2;
          await effect(...args);
          count += 1;
        };
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
      actions: {
        async addRemote(action, { dispatch }) {
          await delay(100);
          await dispatch({ type: 'add' });
        },
      },
    });

    app.start();

    expect(app._store.getState().loading).toEqual(false);

    app._store.dispatch({ type: 'count/addRemote' });
    expect(app._store.getState().loading).toEqual(true);
    expect(modelNamespace).toEqual('count');
    expect(expectedKey).toEqual('count/addRemote');

    setTimeout(() => {
      expect(app._store.getState().loading).toEqual(false);
      expect(app._store.getState().count).toEqual(1);
      expect(count).toEqual(5);
      done();
    }, 200);
  });

  it('return Promise', done => {
    const app = create();
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch, getState }) {
          await delay(payload.delay || 100);
          await dispatch({ type: 'add', payload: payload.amount });
          return getState().count;
        },
      },
    });
    app.start();
    const p1 = app._store.dispatch({
      type: 'count/addDelay',
      payload: { amount: 2 },
    });
    const p2 = app._store.dispatch({
      type: 'count/add',
      payload: 2,
    });
    expect(p1 instanceof Promise).toEqual(true);
    expect(p2).toEqual({ type: 'count/add', payload: 2 });
    expect(app._store.getState().count).toEqual(2);
    p1.then(count => {
      expect(count).toEqual(4);
      expect(app._store.getState().count).toEqual(4);
      done();
    });
  });

  it('return Promises when trigger the same effect multiple times', done => {
    const app = create();
    app.model({
      namespace: 'count',
      state: 0,
      mutations: {
        add(state, { payload }) {
          state.count += payload || 1;
        },
      },
      actions: {
        async addDelay({ payload }, { dispatch, getState }) {
          await delay(payload.delay || 100);
          await dispatch({ type: 'add', payload: payload.amount });
          return getState().count;
        },
      },
    });
    app.start();

    const p1 = app._store.dispatch({
      type: 'count/addDelay',
      payload: { delay: 100, amount: 1 },
    });
    const p2 = app._store.dispatch({
      type: 'count/add',
      payload: 2,
    });
    const p3 = app._store.dispatch({
      type: 'count/addDelay',
      payload: { delay: 200, amount: 3 },
    });
    expect(p1 instanceof Promise).toEqual(true);
    expect(p2).toEqual({ type: 'count/add', payload: 2 });
    expect(app._store.getState().count).toEqual(2);
    p1.then(count => {
      expect(count).toEqual(3);
      expect(app._store.getState().count).toEqual(3);
      p3.then(count => {
        expect(count).toEqual(6);
        expect(app._store.getState().count).toEqual(6);
        done();
      });
    });
  });
});
