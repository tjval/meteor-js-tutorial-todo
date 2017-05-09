import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';


// App component represents the whole App
class App extends Component {
  // Use the constructor to set the hideCompleted state
  constructor(props) {
    super(props);

    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    this.state = {
      hideCompleted: false,
    };
  }

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

  // Hides a task if it is completed by switching its state
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  // Maps Task component to HTML
  // Filters tasks by completed or not completed
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  // Puts it all together and renders every task
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
             <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted}
            ></input>
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

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
  incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
    // We want the new tasks to appear at the top
    // so we sort them
    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    };
  }, App);
