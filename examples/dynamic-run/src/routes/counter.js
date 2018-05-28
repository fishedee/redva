import { connect } from 'redva';
import React from 'react';

class Counter extends React.PureComponent {
  inc() {
    this.props.dispatch({
      type: 'counter/inc',
    });
  }
  dec() {
    this.props.dispatch({
      type: 'counter/dec',
    });
  }
  render() {
    return (
      <div>
        <div>{this.props.counter}</div>
        <button onClick={this.inc.bind(this)}>+</button>
        <button onClick={this.dec.bind(this)}>-</button>
      </div>
    );
  }
}

export default connect(state => {
  console.log('ut',state);
  return { 
    counter: state.counter 
  }
})(Counter);
