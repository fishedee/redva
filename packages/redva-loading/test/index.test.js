import expect from 'expect';
import redva from 'redva';
import createLoading from '../src/index';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

describe('redva-loading', () => {
  it('normal', done => {
    const app = redva();
    app.use(createLoading());
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
    app.router(() => 1);
    app.start();

    expect(app._store.getState().loading).toEqual({
      global: false,
      models: {},
      actions: {},
    });
    app._store.dispatch({ type: 'count/addRemote' });
    expect(app._store.getState().loading).toEqual({
      global: true,
      models: { count: true },
      actions: { 'count/addRemote': true },
    });
    setTimeout(() => {
      expect(app._store.getState().loading).toEqual({
        global: false,
        models: { count: false },
        actions: { 'count/addRemote': false },
      });
      done();
    }, 200);
  });

  it('opts.effects', done => {
    const app = redva();
    app.use(
      createLoading({
        effects: true,
      })
    );
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
    app.router(() => 1);
    app.start();

    expect(app._store.getState().loading).toEqual({
      global: false,
      models: {},
      actions: {},
    });
    app._store.dispatch({ type: 'count/addRemote' });
    expect(app._store.getState().loading).toEqual({
      global: true,
      models: { count: true },
      actions: { 'count/addRemote': true },
    });
    setTimeout(() => {
      expect(app._store.getState().loading).toEqual({
        global: false,
        models: { count: false },
        actions: { 'count/addRemote': false },
      });
      done();
    }, 200);
  });

  it('opts.namespace', () => {
    const app = redva();
    app.use(
      createLoading({
        namespace: 'fooLoading',
      })
    );
    app.model({
      namespace: 'count',
      state: 0,
    });
    app.router(() => 1);
    app.start();
    expect(app._store.getState().fooLoading).toEqual({
      global: false,
      models: {},
      actions: {},
    });
  });

  it('opts.only', () => {
    const app = redva();
    app.use(
      createLoading({
        only: ['count/a'],
      })
    );
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async a(action, { dispatch }) {
          await delay(500);
        },
        async b(action, { dispatch }) {
          await delay(500);
        },
      },
    });
    app.router(() => 1);
    app.start();

    expect(app._store.getState().loading).toEqual({
      global: false,
      models: {},
      actions: {},
    });
    app._store.dispatch({ type: 'count/a' });
    setTimeout(() => {
      expect(app._store.getState().loading).toEqual({
        global: true,
        models: { count: true },
        actions: { 'count/a': true },
      });
      app._store.dispatch({ type: 'count/b' });
      setTimeout(() => {
        expect(app._store.getState().loading).toEqual({
          global: false,
          models: { count: false },
          actions: { 'count/a': false },
        });
      }, 300);
    }, 300);
  });

  it('opts.except', () => {
    const app = redva();
    app.use(
      createLoading({
        except: ['count/a'],
      })
    );
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async a(action, { dispatch }) {
          await delay(500);
        },
        async b(action, { dispatch }) {
          await delay(500);
        },
      },
    });
    app.router(() => 1);
    app.start();

    expect(app._store.getState().loading).toEqual({
      global: false,
      models: {},
      actions: {},
    });
    app._store.dispatch({ type: 'count/a' });
    setTimeout(() => {
      expect(app._store.getState().loading).toEqual({
        global: false,
        models: {},
        actions: {},
      });
      app._store.dispatch({ type: 'count/b' });
      setTimeout(() => {
        expect(app._store.getState().loading).toEqual({
          global: true,
          models: { count: true },
          actions: { 'count/b': true },
        });
      }, 300);
    }, 300);
  });

  it('opts.only and opts.except ambiguous', () => {
    expect(() => {
      const app = redva();
      app.use(
        createLoading({
          only: ['count/a'],
          except: ['count/b'],
        })
      );
    }).toThrow('ambiguous');
  });

  it('multiple effects', done => {
    const app = redva();
    app.use(createLoading());
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async a(action, { dispatch }) {
          await delay(100);
        },
        async b(action, { dispatch }) {
          await delay(500);
        },
      },
    });
    app.router(() => 1);
    app.start();
    app._store.dispatch({ type: 'count/a' });
    app._store.dispatch({ type: 'count/b' });
    setTimeout(() => {
      expect(app._store.getState().loading.models.count).toEqual(true);
    }, 200);
    setTimeout(() => {
      expect(app._store.getState().loading.models.count).toEqual(false);
      done();
    }, 800);
  });

  it('error catch', done => {
    const app = redva({
      onError(err) {
        err.preventDefault();
        console.log('failed', err.message);
      },
    });
    app.use(createLoading());
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async throwError(action, { dispatch }) {
          await delay(100);
          throw new Error('haha');
        },
      },
    });
    app.router(() => 1);
    app.start();

    app._store.dispatch({ type: 'count/throwError' });
    expect(app._store.getState().loading.global).toEqual(true);
    setTimeout(() => {
      expect(app._store.getState().loading.global).toEqual(false);
      done();
    }, 200);
  });

  it('return value', done => {
    const app = redva({
      onError(err) {
        err.preventDefault();
        console.log('failed', err.message);
      },
    });
    app.use(createLoading());
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async doSomething(action, { dispatch }) {
          await delay(100);
          return "123";
        },
      },
    });
    app.router(() => 1);
    app.start();

    let promise = app._store.dispatch({ type: 'count/doSomething' });
    expect(app._store.getState().loading.global).toEqual(true);
    promise.then((result)=>{
      expect(app._store.getState().loading.global).toEqual(false);
      expect(result).toEqual("123");
      done();
    });
  });

  it('error catch from deep', done => {
    const app = redva({
      onError(err) {
        err.preventDefault();
        console.log('failed', err.message);
      },
    });
    app.use(createLoading());
    app.model({
      namespace: 'count',
      state: 0,
      actions: {
        async doSomething(action,{dispatch}){
          throw "error";
        },
        async doSomething2(action, { dispatch }) {
          await dispatch({
            type:"doSomething"
          });
        },
      },
    });
    app.router(() => 1);
    app.start();

    let promise = app._store.dispatch({ type: 'count/doSomething2' });
    expect(app._store.getState().loading.global).toEqual(true);
    promise
      .then(()=>{
        expect("do not run here!").toEqual(false);
      })
      .catch((err)=>{
        expect(app._store.getState().loading.global).toEqual(false);
        expect(err).toEqual("error");
        done();
      });
  });
});
