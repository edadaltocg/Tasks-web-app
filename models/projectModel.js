const mongoose = require('./connect');
const ObjectId = mongoose.Schema.Types.ObjectId;

// A scheme describing the projects registered in the database
const projectSchema = mongoose.Schema({
    name: String,
    members: [{ type : ObjectId, ref : 'User'}]
});

// Prepare a collection named 'projects' after pluralizing 'Project'
const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;