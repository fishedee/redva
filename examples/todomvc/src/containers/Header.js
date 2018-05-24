import React from 'react';
import { connect } from 'redva';
import TodoTextInput from '../components/TodoTextInput';

export const Header = props => (
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={text => {
        if (text.length !== 0) {
          props.dispatch({
            type: 'todos/ADD_TODO',
            text: text,
          });
        }
      }}
      placeholder="What needs to be done?"
    />
  </header>
);

export default connect()(Header);
