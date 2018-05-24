import React from 'react';
import redva from 'redva';
import App from './components/App';
import todos from './models/todos';
import visibilityFilter from './models/visibilityFilter';
import 'todomvc-app-css/index.css';

const app = redva();

app.model(todos);
app.model(visibilityFilter);

app.router(() => <App />);

app.start('#root');
