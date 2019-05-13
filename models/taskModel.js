const mongoose = require('./connect');
const ObjectId = mongoose.Schema.Types.ObjectId;

// A scheme describing the projects registered in the database
const taskSchema = mongoose.Schema({
    project : {type : ObjectId, ref : 'Project'},
    name : String,
    description : String,
    assignee : { type : ObjectId, ref : 'User'},
    start_date : Date,
    due_date : Date,
    advancement : Number,
    status : { type : ObjectId, ref : 'Status'},
    priority : { type : ObjectId, ref : 'Priority'}
});

// Prepare a collection named 'tasks' after pluralizing 'Task'
const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;