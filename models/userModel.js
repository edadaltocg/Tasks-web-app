const mongoose = require('./connect');


// A scheme describing users registered in the database
const userSchema = mongoose.Schema({

    name: String,
    firstname: String,
    login: String,
    password: String,
    roles: [String],
    flag: Boolean
});

// Prepare a collection named 'users' after pluralizing 'User'
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;