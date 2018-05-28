const shouldFetchPosts = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
};

const createOrGetSubreddit = (postsBySubreddit, subreddit) => {
  let reddit = postsBySubreddit[subreddit];
  if (!reddit) {
    reddit = {
      isFetching: false,
      didInvalidate: false,
      items: [],
    };
    postsBySubreddit[subreddit] = reddit;
  }
  return reddit;
};

export default {
  namespace: 'postsBySubreddit',
  state: {},
  mutations: {
    invalidateSubreddit(state, action) {
      const subreddit = createOrGetSubreddit(
        state.postsBySubreddit,
        action.subreddit
      );
      subreddit.didInvalidate = true;
    },
    requestPosts(state, action) {
      const subreddit = createOrGetSubreddit(
        state.postsBySubreddit,
        action.subreddit
      );
      subreddit.isFetching = true;
      subreddit.didInvalidate = false;
    },
    receivePosts(state, action) {
      const subreddit = createOrGetSubreddit(
        state.postsBySubreddit,
        action.subreddit
      );
      subreddit.isFetching = false;
      subreddit.didInvalidate = false;
      subreddit.items = action.posts;
      subreddit.lastUpdated = action.receivedAt;
    },
  },
  actions: {
    async fetchPosts(action, { dispatch, getState }) {
      dispatch({
        type: 'requestPosts',
        subreddit: action.subreddit,
      });
      let response = await fetch(
        `https://www.reddit.com/r/${action.subreddit}.json`
      );
      let json = await response.json();
      dispatch({
        type: 'receivePosts',
        subreddit: action.subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now(),
      });
    },
    fetchPostsIfNeeded(action, { dispatch, getState }) {
      if (shouldFetchPosts(getState(), action.subreddit)) {
        dispatch({
          type: 'fetchPosts',
          subreddit: action.subreddit,
        });
      }
    },
  },
};
