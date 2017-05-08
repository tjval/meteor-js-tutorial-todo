import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';


// App component represents the whole App
class App extends Component {

  // Returns a list of tasks
  /*
  getTasks() {
    return [
      { _id: 1, text: 'This is task 1'},
      { _id: 2, text: 'This is task 2'},
      { _id: 3, text: 'This is task 3'},
    ];
  }*/

  // Maps Task component to HTML
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  // Puts it all together and renders every task
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
} // default class React

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}).fetch(),
  };
}, App);
