import React from 'react';
import redva from 'redva';
import redvaLoading from 'redva-loading';
import postsBySubreddit from './models/postsBySubreddit';
import selectedSubreddit from './models/selectedSubreddit';
import App from './containers/App';

const app = redva({
});

app.use(new redvaLoading());

app.model(postsBySubreddit);
app.model(selectedSubreddit);

app.router(() => <App />);
app.start('#root');
