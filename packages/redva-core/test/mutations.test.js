import expect from 'expect';
import { create } from '../src/index';

describe('reducers', () => {
  it('extraReducers', () => {
    const reducers = {
      count: (state, { type }) => {
        if (type === 'add') {
          return state + 1;
        }
        // default state
        return 0;
      },
    };
    const app = create({
      extraReducers: reducers,
    });
    app.start();

    expect(app._store.getState().count).toEqual(0);
    app._store.dispatch({ type: 'add' });
    expect(app._store.getState().count).toEqual(1);
  });

  it('onMutation ', () => {
    let mutationCount = 0;
    const onMutation = r => (state, action) => {
      r(state, action);
      mutationCount++;
    };
    const app = create({
      onMutation: onMutation,
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
    app.start();

    app._store.dispatch({ type: 'count/add' });
    expect(app._store.getState().count).toEqual(1);
    app._store.dispatch({ type: 'count/add' });
    app._store.dispatch({ type: 'count/add' });
    expect(app._store.getState().count).toEqual(3);
    expect(mutationCount).toEqual(3);
  });
});
