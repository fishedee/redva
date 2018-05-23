import warning from 'warning';
import { isArray } from './utils';
import { NAMESPACE_SEP } from './constants';

function prefix(obj, namespace, type) {
  return Object.keys(obj).reduce((memo, key) => {
    warning(
      key.indexOf(`${namespace}${NAMESPACE_SEP}`) !== 0,
      `[prefixNamespace]: ${type} ${key} should not be prefixed with namespace ${namespace}`
    );
    const newKey = `${namespace}${NAMESPACE_SEP}${key}`;
    memo[newKey] = obj[key];
    return memo;
  }, {});
}

export default function prefixNamespace(model) {
  const { namespace, actions, mutations } = model;

  if (mutations) {
    if (isArray(mutations)) {
      model.mutations[0] = prefix(mutations[0], namespace, 'mutations');
    } else {
      model.mutations = prefix(mutations, namespace, 'mutations');
    }
  }
  if (actions) {
    model.actions = prefix(actions, namespace, 'actions');
  }
  return model;
}
