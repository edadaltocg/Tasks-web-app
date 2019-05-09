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

/*GET add a project form page*/
router.get('/new/project', async(req, res) => {
    //CHANGER TOUT LE BODY
    //Fetching the instructions from the URL
    let projectFilter;
    if(req.params.project_id) {projectFilter = req.params.project_id};

    //Extracting the right project
    let projectPopulateQuery = {path : 'members', select : 'name firstname'};
    let project = await Project.findOne({_id : projectFilter})
        .populate(projectPopulateQuery);

    //Extracting all the status names from the database
    let status = await Status.find();

    res.render('taskForm',{project : project, members : project.members, status : status,
        firstName : req.session.firstname , lastName : req.session.name});
});

/*GET update a project form page*/
router.get('/update/project/:project_id', async(req, res) => {
    //CHANGER TOUT LE BODY
    //Fetching the instructions from the URL
    let projectFilter;
    if(req.params.project_id) {projectFilter = req.params.project_id};

    //Extracting the right project
    let projectPopulateQuery = {path : 'members', select : 'name firstname'};
    let project = await Project.findOne({_id : projectFilter})
        .populate(projectPopulateQuery);

    //Extracting all the status names from the database
    let status = await Status.find();

    res.render('taskForm',{project : project, members : project.members, status : status,
        firstName : req.session.firstname , lastName : req.session.name});
});

/* Remove Project: suppress userID from member list*/
router.get('/remove/project/:project_id', async(req,res) =>{
    // CHANGE ALL THE BODY
    var filter = {_id: req.params.task_id};
    var task = await Task.find(filter);
    var proj = await Project.find({_id:task[0].project});
    await Task.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
    });
    console.log(proj[0])
    res.redirect('/project/' + proj[0]._id);
});

module.exports = router;