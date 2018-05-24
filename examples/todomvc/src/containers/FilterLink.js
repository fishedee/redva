import { connect } from 'react-redux';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: () => {
    dispatch({
      type: 'visibilityFilter/SET_VISIBILITY_FILTER',
      filter: ownProps.filter,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Link);
