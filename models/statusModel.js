const mongoose = require('./connect');

// A scheme describing the status that a task can have
const statusSchema = mongoose.Schema({
    name: String
});

// Prepare a collection named 'statusess' (name has been chose to fit the existing collection)
const statusModel = mongoose.model('Status', statusSchema,'statuses');

module.exports = statusModel;