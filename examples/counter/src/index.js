import React from 'react';
import redva, { connect } from 'redva';

import counter from './models/counter';

// 1. Initialize
const app = redva({});

// 2. Model
app.model(counter);

// 3. View
const App = connect(state => {
  return { counter: state.counter };
})(props => {
  return (
    <div style={{ textAlignLast: 'center' }}>
      <h2>Count: {props.counter}</h2>
      <button
        onClick={() => {
          props.dispatch({ type: 'counter/minus' });
        }}
      >
        -
      </button>
      <button
        onClick={() => {
          props.dispatch({ type: 'counter/add' });
        }}
      >
        +
      </button>
    </div>
  );
});

// 4. Router
app.router(() => <App />);

// 5. Start
app.start('#root');
