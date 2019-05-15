const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Status = require('../models/statusModel')

const router = express.Router();


/* GET projects page :
*    lists all the projects of the user that has logged in*/
router.get('/projects', async (req, res) => {
    //Extracting the projects of the user from the database
    let projectData = await Project.find({members: req.session.userId});

    res.render('projects', {
        projects: projectData,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*GET add a project form page*/
router.get('/project/new', async (req, res) => {

    console.log(req.session);

    //Extracting all users from database
    let usersData = await User.find();

    res.render('projectForm', {
        dbElement: 'project', element: null, users: usersData,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*POST project*/
router.post('/project/post/:par', async (req, res) => {

    if (req.params.par == 'new') {//No corresponding project has been found => Creating new project

        // create a new instance in memory from the message body
        let project = await new Project(req.body);
        // save a document to the database based on the instance content
        await project.save();
        // saved ok: go back to the project page
        let redirectLink = '/projects';
        return res.redirect(redirectLink);
    } else { // Udpate project
        //Fetching the id of the project to update from the URL
        let projectFilter = {_id: req.params.par};

        //Loading the changes from the form
        let projectUpdates = req.body;
        console.log(req.body);
        // update the task on the database
        await Project.updateOne(projectFilter, projectUpdates);

        // saved ok: go back to the task page
        let redirectLink = '/projects';
        return res.redirect(redirectLink);
    }
});

/* GET a specific project page*/
router.get('/project/:project_id', async (req, res) => {

    //Fetching the instructions from the URL
    let projectFilter;
    if (req.params.project_id) {
        projectFilter = req.params.project_id
    }


    //Extracting the project of the user from the database
    let project = await Project.findOne({_id: projectFilter});
    //Extracting the tasks of the user's project from the database
    let taskPopulateQuery = [{path : 'assignee', select : 'name firstname'},{path : 'status', select : 'name'}];
    let tasks = await Task.find({project: projectFilter})
        .populate(taskPopulateQuery);
    res.render('project', {
        project: project, tasks: tasks,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*GET update a project form page*/
router.get('/project/update/:project_id', async (req, res) => {

    //Fetching the instructions from the URL
    let projectFilter;
    if (req.params.project_id) {
        projectFilter = req.params.project_id
    }

    //Extracting the right project
    let projectPopulateQuery = {path: 'members', select: 'name firstname'};
    let project = await Project.findOne({_id: projectFilter})
        .populate(projectPopulateQuery);

    let usersData = await User.find();


    res.render('projectForm', {
        dbElement: 'project', element: project, users: usersData,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/* Remove Project: suppress userID from member list*/
router.get('/project/remove/:project_id', async (req, res) => {
    // MUDAR?? APENAS TIRAR O USER DE MEMBERS
    var filter = {_id: req.params.project_id};

    await Project.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
    });

    res.redirect('http://localhost:3000/settings');
});

module.exports = router;