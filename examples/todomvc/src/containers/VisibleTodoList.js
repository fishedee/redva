import { connect } from 'redva';
import TodoList from '../components/TodoList';
import { getVisibleTodos } from '../selectors';

const mapStateToProps = state => ({
  filteredTodos: getVisibleTodos(state),
});

const mapDispatchToProps = dispatch => ({
  actions: {
    editTodo: (id, text) => {
      dispatch({
        type: 'todos/EDIT_TODO',
        id: id,
        text: text,
      });
    },
    deleteTodo: id => {
      dispatch({
        type: 'todos/DELETE_TODO',
        id: id,
      });
    },
    completeTodo: id => {
      dispatch({
        type: 'todos/COMPLETE_TODO',
        id: id,
      });
    },
    newTodo: id => {
      dispatch({
        type: 'todos/ADD_TODO',
        id: id,
      });
    },
  },
});

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;
