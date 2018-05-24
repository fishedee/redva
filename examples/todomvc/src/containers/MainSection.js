import { connect } from 'redva';
import MainSection from '../components/MainSection';
import { getCompletedTodoCount } from '../selectors';

const mapStateToProps = state => ({
  todosCount: state.todos.length,
  completedCount: getCompletedTodoCount(state),
});

const mapDispatchToProps = dispatch => ({
  actions: {
    completeAllTodos: () => {
      dispatch({
        type: 'todos/COMPLETE_ALL_TODOS',
      });
    },
    clearCompleted: () => {
      dispatch({
        type: 'todos/CLEAR_COMPLETED',
      });
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
