import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper';


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
    Meteor.call('tasks.insert', text);

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
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
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

          { this.props.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form> : ''
        }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
} // default class React

// Think of these like variables
App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
    Meteor.subscribe('tasks');

    // We want the new tasks to appear at the top
    // so we sort them
    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    };
  }, App);
