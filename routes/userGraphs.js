const express = require('express');

const Project = require('../models/projectModel')
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Journal = require('../models/journalModel');
const Status = require('../models/statusModel');

const router = express.Router();

/* GET user's summary page*/
router.get('/', async(req, res) => {
    let projects = await Project.find();
    let tasks = await Task.find();
    let users = await User.find();
    let journals = await Journal.find().populate("task");
    let data = [ [ 2019, 8, 9, 1 ],
        [ 2019, 8, 1, 1 ],
        [ 2019, 8, 13, 1 ],
        [ 2019, 8, 5, 1 ],
        [ 2019, 8, 6, 1 ],
        [ 2019, 8, 8, 1 ] ]
    ;
    res.render('userGraphs',{projects : projects, tasks : tasks, users : users, journals: journals, data: data,
        firstName : req.session.firstname , lastName : req.session.name, userId : req.session.userId});
});

module.exports = router;