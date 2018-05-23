function applyOnMutation(fns, mutation, model, key) {
  for (const fn of fns) {
    mutation = fn(mutation, model, key);
  }
  return mutation;
}

export default function getMutation(reducers, onMutation, model) {
  let newHandlers = {};
  reducers = reducers || {};
  for (let key in reducers) {
    if (Object.prototype.hasOwnProperty.call(reducers, key)) {
      newHandlers[key] = applyOnMutation(onMutation, reducers[key], model, key);
    }
  }
  return newHandlers;
}
