function findTodo(todos, id) {
  return todos.findIndex(todo => {
    return todo.id == id;
  });
}
export default {
  namespace: 'todos',
  state: [
    {
      text: 'Use Redux',
      completed: false,
      id: 0,
    },
  ],
  mutations: {
    ADD_TODO(state, action) {
      let maxId = state.todos.reduce(
        (maxId, todo) => Math.max(todo.id, maxId),
        -1
      );
      state.todos.push({
        id: maxId + 1,
        completed: false,
        text: action.text,
      });
    },
    DELETE_TODO(state, action) {
      let index = findTodo(state.todos, action.id);
      if (index != -1) {
        state.todos.splice(index, 1);
      }
    },
    EDIT_TODO(state, action) {
      let index = findTodo(state.todos, action.id);
      if (index != -1) {
        state.todos[index].text = action.text;
      }
    },
    COMPLETE_TODO(state, action) {
      let index = findTodo(state.todos, action.id);
      if (index != -1) {
        state.todos[index].completed = !state.todos[index].completed;
      }
    },
    COMPLETE_ALL_TODOS(state, action) {
      let areAllMarked = state.todos.every(todo => todo.completed);
      for (let i in state.todos) {
        state.todos[i].completed = !areAllMarked;
      }
    },
    CLEAR_COMPLETED(state, action) {
      state.todos = state.todos.filter(todo => todo.completed === false);
    },
  },
};
