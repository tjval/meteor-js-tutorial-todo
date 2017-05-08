import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';


// App component represents the whole App
class App extends Component {
  handleSubmit(event){
    event.preventDefault();

    // find the text field via React
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    // Add this to the MongoDB
    Tasks.insert({
      text,
      createdAt: new Date(),
    });

    // Clear the form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
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

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
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
