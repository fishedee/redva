export default {
  namespace: 'todo',
  state: [
    {
      id: 1,
      text: 'Hello Redva',
    },
  ],
  mutations: {
    add(state, action) {
      let maxId = state.todo.reduce(
        (maxId, todo) => Math.max(todo.id, maxId),
        -1
      );
      state.todo.push({
        id: maxId + 1,
        text: action.text,
      });
    },
    del(state, action) {
      let index = state.todo.findIndex(todo => {
        return todo.id == action.id;
      });
      if (index != -1) {
        state.todo.splice(index, 1);
      }
    },
  },
};
