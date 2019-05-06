const mongoose = require('./connect');
const ObjectId = mongoose.Schema.Types.ObjectId;

// A scheme describing users registered in the database
const userSchema = mongoose.Schema({
    _id : ObjectId,
    name: String,
    firstname: String,
    login: String,
    password: String
});

// Prepare a collection named 'users' after pluralizing 'User'
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;