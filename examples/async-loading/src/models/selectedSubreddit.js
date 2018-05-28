export default {
  namespace: 'selectedSubreddit',
  state: 'reactjs',
  mutations: {
    selectSubreddit(state, action) {
      state.selectedSubreddit = action.subreddit;
    },
  },
};
