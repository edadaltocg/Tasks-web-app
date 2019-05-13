const mongoose = require('mongoose');

//Connecting to the database 'calendme'
mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true});

module.exports = mongoose;