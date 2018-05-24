import React from 'react';
import redva from 'redva';
import { createLogger } from 'redux-logger';
import postsBySubreddit from './models/postsBySubreddit';
import selectedSubreddit from './models/selectedSubreddit';
import App from './containers/App';

const app = redva({
  extraMiddlewares: createLogger(),
});

app.model(postsBySubreddit);
app.model(selectedSubreddit);

app.router(() => <App />);
app.start('#root');
