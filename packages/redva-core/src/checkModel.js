import invariant from 'invariant';
import { isArray, isFunction, isPlainObject } from './utils';

export default function checkModel(model, existModels) {
  const { namespace, mutations, actions, subscriptions, state } = model;

  // namespace 必须被定义
  invariant(namespace, `[app.model] namespace should be defined`);
  // 并且是字符串
  invariant(
    typeof namespace === 'string',
    `[app.model] namespace should be string, but got ${typeof namespace}`
  );
  // 并且唯一
  invariant(
    !existModels.some(model => model.namespace === namespace),
    `[app.model] namespace should be unique`
  );

  // state 任意

  // mutations 可以为空，PlainObject 或者数组
  if (mutations) {
    invariant(
      isPlainObject(mutations),
      `[app.model] mutations should be plain object, but got ${typeof mutations}`
    );
  }

  // actions 可以为空，PlainObject
  if (actions) {
    invariant(
      isPlainObject(actions),
      `[app.model] actions should be plain object, but got ${typeof actions}`
    );
  }

  if (subscriptions) {
    // subscriptions 可以为空，PlainObject
    invariant(
      isPlainObject(subscriptions),
      `[app.model] subscriptions should be plain object, but got ${typeof subscriptions}`
    );

    // subscription 必须为函数
    invariant(
      isAllFunction(subscriptions),
      `[app.model] subscription should be function`
    );
  }
}

function isAllFunction(obj) {
  return Object.keys(obj).every(key => isFunction(obj[key]));
}
