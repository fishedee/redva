export default {
  namespace: 'counter',
  state: 0,
  mutations: {
    add(state) {
      state.counter += 1;
    },
    minus(state) {
      state.counter -= 1;
    },
  },
};
