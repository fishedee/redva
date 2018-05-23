import invariant from 'invariant';
import prefixedDispatch from './prefixedDispatch';
import { isFunction } from './utils';

export default function getAction(effects, model, onError, onEffect) {
  let actions = {};
  for (const key in effects) {
    if (Object.prototype.hasOwnProperty.call(effects, key)) {
      actions[key] = getSingleAction(
        key,
        effects[key],
        model,
        onError,
        onEffect
      );
    }
  }
  return actions;
}

function getSingleAction(key, effect, model, onError, onEffect) {
  invariant(isFunction(effect), '[model.action]: action should be function');
  let actionWithCatch = async function(action, { dispatch, ...rest }) {
    try {
      dispatch = prefixedDispatch(dispatch, model);
      return await effect(action, { dispatch, ...rest });
    } catch (e) {
      onError(e, {
        key,
        actionArgs: arguments,
      });
      if (!e._dontReject) {
        throw e;
      }
    }
  };
  const actionWithOnEffect = applyOnEffect(
    onEffect,
    actionWithCatch,
    model,
    key
  );
  return actionWithOnEffect;
}

function applyOnEffect(fns, effect, model, key) {
  for (const fn of fns) {
    effect = fn(effect, model, key);
  }
  return effect;
}
