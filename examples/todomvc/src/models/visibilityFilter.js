import { SHOW_ALL } from '../constants/TodoFilters';
export default {
  namespace: 'visibilityFilter',
  state: SHOW_ALL,
  mutations: {
    SET_VISIBILITY_FILTER(state, action) {
      state.visibilityFilter = action.filter;
    },
  },
};
