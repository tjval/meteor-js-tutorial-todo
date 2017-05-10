import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

// This code only should run on the Server
if (Meteor.isServer ){

  // Only publish tasks that are public or belong to the user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true }},
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);


    // Make sure the user is logged in before doing DB insert
    if (!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },

  'tasks.remove'(taskId){
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    //if(task.private && task.owner !== Meteor.userId()){
    //  throw new Meteor.Error('not-authorized');
    //}

    if(task.owner === Meteor.userId())
      Tasks.remove(taskId);
    else {
      throw new Meteor.Error('not-authorized');
    }
  },

  'tasks.setChecked'(taskId, setChecked){
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the owner can do this
    if(task.owner === Meteor.userId()){
      Tasks.update(taskId, { $set: {checked: setChecked }});
    } else {
      throw new Meteor.Error('not-authorized');
    }
  },

  'tasks.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the owner can do this
    if(task.owner === Meteor.userId()){
      Tasks.update(taskId, { $set: { private: setToPrivate}});
    } else {
      throw new Meteor.Error('not-authorized');
    }
  },

});
