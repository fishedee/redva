export default {
  namespace: 'counter',
  state: 0,
  mutations: {
    inc(state, action) {
      state.counter += 1;
    },
    dec(state, action) {
      state.counter -= 1;
    },
  },
};
