import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'redva';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  static propTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props;
    dispatch({
      type: 'postsBySubreddit/fetchPostsIfNeeded',
      subreddit: selectedSubreddit,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = nextProps;
      dispatch({
        type: 'postsBySubreddit/fetchPostsIfNeeded',
        subreddit: selectedSubreddit,
      });
    }
  }

  handleChange = nextSubreddit => {
    this.props.dispatch({
      type: 'selectedSubreddit/selectSubreddit',
      subreddit: nextSubreddit,
    });
  };

  handleRefreshClick = e => {
    e.preventDefault();

    const { dispatch, selectedSubreddit } = this.props;
    dispatch({
      type: 'postsBySubreddit/invalidateSubreddit',
      subreddit: selectedSubreddit,
    });
    dispatch({
      type: 'postsBySubreddit/fetchPostsIfNeeded',
      subreddit: selectedSubreddit,
    });
  };

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
    const isEmpty = posts.length === 0;
    return (
      <div>
        <Picker
          value={selectedSubreddit}
          onChange={this.handleChange}
          options={['reactjs', 'frontend']}
        />
        <p>
          {lastUpdated && (
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
            </span>
          )}
          {!isFetching && (
            <button onClick={this.handleRefreshClick}>Refresh</button>
          )}
        </p>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit } = state;
  const isFetching = !!state.loading.actions['postsBySubreddit/fetchPosts'];
  const { lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    items: [],
  };

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated,
  };
};

export default connect(mapStateToProps)(App);
