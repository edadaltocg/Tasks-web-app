const express = require('express');

const Project = require('../models/projectModel')
const Task = require('../models/taskModel');
const Journal = require('../models/journalModel');
const Status = require('../models/statusModel');

const router = express.Router();

/* GET user's summary page*/
router.get('/', async(req, res) => {
    let projectPopulateQuery = {path : 'members', select : 'name firstname -_id'};
    let projects = await Project.find({members: req.session.userId})
        .populate(projectPopulateQuery);

    let taskPopulateQuery = [{path : 'project', select : 'name'},
        {path : 'status', select : 'name -_id'}];
    let tasks = await Task.find({assignee : req.session.userId})
        .populate(taskPopulateQuery);

    let finishedTasks = await Task.find({assignee : req.session.userId, status : '5cac811bf91f9f2030bd6dc7'})
        .populate(taskPopulateQuery);

    console.log(projects);
    res.render('userSummary',{projects : projects, tasks : tasks, finishedTasks : finishedTasks});
});

module.exports = router;