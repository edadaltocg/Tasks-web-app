const mongoose = require('./connect');

// A scheme describing the priorities that a task can have
const prioritySchema = mongoose.Schema({
    name: String
});

// Prepare a collection named 'priorities'
const priorityModel = mongoose.model('Priority', prioritySchema,'priorities');

module.exports = priorityModel;