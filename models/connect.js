const mongoose = require('mongoose');

//Connecting to the database 'calendme'
mongoose.connect('mongodb://localhost:27017/calendme', {useNewUrlParser: true});

module.exports = mongoose;