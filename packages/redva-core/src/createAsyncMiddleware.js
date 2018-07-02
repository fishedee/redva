import invariant from 'invariant';
import { isFunction } from './utils';
import {resetType} from './utils';

export default function createAsyncMiddleware() {
  let actions;
  function run(models) {
    actions = {};
    for (const key in models) {
      const model = models[key];
      for (const name in model) {
        let action = model[name];
        invariant(
          isFunction(action),
          `[model.actions] action should be function, but got ${typeof action}`
        );
        actions[name] = action;
      }
    }
  }
  let asyncMiddleware = argv => next => action => {
    let { type } = action;
    type = resetType(type);
    const handler = actions[type];
    if (handler) {
      return handler(action, argv);
    } else {
      return next(action);
    }
  };
  asyncMiddleware.run = run;
  return asyncMiddleware;
}
