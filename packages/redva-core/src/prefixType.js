import { NAMESPACE_SEP } from './constants';

export default function prefixType(type, model) {
  const prefixedType = `${model.namespace}${NAMESPACE_SEP}${type}`;
  const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');
  if (
    (model.mutations && model.mutations[typeWithoutAffix]) ||
    (model.actions && model.actions[typeWithoutAffix])
  ) {
    return prefixedType;
  }
  return type;
}
