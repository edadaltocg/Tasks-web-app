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
        {path : 'status', select : 'name'},
        {path : 'priority', select : 'name firstname'},
        {path : 'assignee', select : 'name firstname'},];
    let tasks = await Task.find({assignee : req.session.userId})
        .populate(taskPopulateQuery);

    let finishedTasks = await Task.find({assignee : req.session.userId, status : '5cac811bf91f9f2030bd6dc7'})
        .populate(taskPopulateQuery);

    let projectTasksArray = [];

    for(let p in projects){
        let project = projects[p];

        let projectTasks = await Task.find({project : project._id})
            .populate(taskPopulateQuery);

        let numberTasks = 0;
        let projectAdvancement=0;

        for(let t in projectTasks){
            let task = projectTasks[t];

            numberTasks += 1;
            projectAdvancement += task.advancement;
        }

        projectAdvancement = projectAdvancement/numberTasks;

        projectTasksArray.push({projectName : project.name, tasks : projectTasks, projectAdvancement});
    }

    res.render('userSummary',{projects : projects,
        tasks : tasks, finishedTasks : finishedTasks,
        projectTasksArray : projectTasksArray,
        firstName : req.session.firstname , lastName : req.session.name, userId : req.session.userId});
});

module.exports = router;