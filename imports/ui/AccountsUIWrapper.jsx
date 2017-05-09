import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
  // Use Blaze to render the login buttons
  componentDidMount(){
    this.view = Blaze.render(Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  }

  // Clean up the view
  componentWillUnmount(){
    Blaze.remove(this.view);
  }

  // Render placeholder container to be filled in
  render() {
    return <span ref="container" />
  }
}
