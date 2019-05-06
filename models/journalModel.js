const mongoose = require('./connect');
const ObjectId = mongoose.Schema.Types.ObjectId;

// A scheme describing the journal linked to every tasks
const journalSchema = mongoose.Schema({
    date : Date,
    entry : String,
    author : { type : ObjectId, ref : 'User'},
    task : { type : ObjectId, ref : 'Task'}
});

// Prepare a collection named 'journals' after pluralizing 'Journal'
const journalModel = mongoose.model('Journal', journalSchema);

module.exports = journalModel;