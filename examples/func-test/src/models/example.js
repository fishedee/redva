export default {
  namespace: 'example',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen(location => {
        console.log(1, location);
      });
    },
  },

  actions: {
    async fetch({ payload }, { dispatch }) {
      // eslint-disable-line
      await dispatch({ type: 'save' });
    },
  },

  mutations: {
    save(state, action) {
      state.example = {
        ...state.example,
        ...action.payload,
      };
    },
  },
};
