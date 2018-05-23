import produce from 'immer';
import invariant from 'invariant';

export function combineReducers(reducers) {
  return (state = {}, action) => {
    let hasChanged = false;
    let nextState = {};
    for (const key in reducers) {
      let prevStateKey = state[key];
      let nextStateKey = reducers[key](prevStateKey, action);
      nextState[key] = nextStateKey;
      hasChanged = hasChanged || nextStateKey !== prevStateKey;
    }
    if (hasChanged == false) {
      return state;
    } else {
      return {
        ...state,
        ...nextState,
      };
    }
  };
}
export default function createImmerReducer(reducers) {
  let defaultState = {};
  let mutations = {};
  for (let key in reducers) {
    defaultState[key] = reducers[key].state;
    for (let action in reducers[key].mutations) {
      mutations[action] = reducers[key].mutations[action];
    }
  }
  return (state = {}, action) => {
    let addState = {};
    let hasAddState = false;
    for (let key in defaultState) {
      if (key in state == false) {
        addState[key] = defaultState[key];
        hasAddState = true;
      }
    }
    if (hasAddState) {
      state = {
        ...state,
        ...addState,
      };
    }
    const { type } = action;
    invariant(type, 'dispatch: action should be a plain Object with type');
    const handler = mutations[type];
    if (handler) {
      const ret = produce(state, draft => {
        handler(draft, action);
      });
      return ret === undefined ? {} : ret;
    } else {
      return state;
    }
  };
}
