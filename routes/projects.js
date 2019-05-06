const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

const router = express.Router();


/* GET projects page :
*    lists all the projects of the user that has logged in*/
router.get('/projects', async(req, res) => {
    //Extracting the projects of the user from the database
    let projectData = await Project.find({members: req.session.userId});

    res.render('projects', {projects : projectData,
        firstName : req.session.firstname , lastName : req.session.name});
});

/* GET a specific project page*/
router.get('/project/:project_id', async(req, res) => {

    //Fetching the instructions from the URL
    let projectFilter;
    if(req.params.project_id) {projectFilter = req.params.project_id};

    //Extracting the project of the user from the database
    let project = await Project.findOne({_id : projectFilter});
    //Extracting the tasks of the user's project from the database
    let tasks = await Task.find({project : projectFilter})
        .populate({path : 'assignee', select : 'name firstname'});

    res.render('project',{project : project, tasks : tasks,
        firstName : req.session.firstname , lastName : req.session.name});
});

module.exports = router;