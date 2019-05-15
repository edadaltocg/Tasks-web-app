const mongoose = require('./connect');

// A scheme describing the status that a task can have
const prioritySchema = mongoose.Schema({
    name: String
});

// Prepare a collection named 'statusess' (name has been chose to fit the existing collection)
const priorityModel = mongoose.model('Priority', prioritySchema,'priorities');

module.exports = priorityModel;