const express = require('express');

const Project = require('../models/projectModel')
const Task = require('../models/taskModel');
const Journal = require('../models/journalModel');
const Status = require('../models/statusModel');
const Priority = require('../models/priorityModel');

const router = express.Router();

/* GET a specific task page*/
router.get('/:task_id', async (req, res) => {

    //Fetching the instructions from the URL
    let taskFilter;
    if (req.params.task_id) {
        taskFilter = req.params.task_id
    };

    //Extracting the selected task from the database
    let taskPopulateQuery = [{path : 'assignee', select : 'name firstname -_id'},
        {path : 'project', select : 'name'},
        {path : 'status', select : 'name -_id'},{path : 'priority', select : 'name -_id'}];
    let task = await Task.findOne({_id : taskFilter})
        .populate(taskPopulateQuery);

    //Extracting the journal of the task
    let journalPopulateQuery = {path: 'author', select: 'name firstname -_id'};
    let journal = await Journal.find({task: taskFilter})
        .populate(journalPopulateQuery);

    res.render('task', {
        task: task, journal: journal,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*GET add a task form page*/
router.get('/new/:project_id', async (req, res) => {

    //Fetching the instructions from the URL
    let projectFilter;
    if (req.params.project_id) {
        projectFilter = req.params.project_id
    }
    ;

    //Extracting the right project
    let projectPopulateQuery = {path: 'members', select: 'name firstname'};
    let project = await Project.findOne({_id: projectFilter})
        .populate(projectPopulateQuery);

    //Extracting all the status names from the database
    let status = await Status.find();

    res.render('taskForm', {
        project: project, members: project.members, status: status,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*GET update a task form page*/
router.get('/update/:task_id', async (req, res) => {

    //Fetching the instructions from the URL
    let taskFilter;
    if (req.params.task_id) {
        taskFilter = req.params.task_id
    }
    ;

    //Extracting the right task
    let task = await Task.findOne({_id : taskFilter})
        .populate([{path : 'assignee'},{path : 'status'},{path : 'priority'}]);
    //Extracting all the members of the project
    let project = await Project.findOne({_id : task.project})
        .populate({path : 'members', select : 'name firstname'});

    //Extracting all the status names from the database
    let status = await Status.find();
    //Extracting all the priorities names from the database
    let priorities = await Priority.find();

    res.render('taskForm',{task : task, project : project,
        members : project.members, status : status, priorities : priorities,
        firstName : req.session.firstname , lastName : req.session.name});
});

/*POST newly added task or updated task, called when the Save button is clicked
* on either one of the forms*/
router.post('/post/:task_id', async (req, res) => {
    if (req.params.task_id == 'new') {//No corresponding task has been found => Creating new task

        // create a new instance in memory from the message body
        let task = Task(req.body);

        // save a document to the database based on the instance content
        await task.save();

        // saved ok: go back to the project page
        let redirectLink = '/task/' + task._id;
        res.redirect(redirectLink);
    } else {
        //Fetching the id of the task to update from the URL
        let taskFilter = {_id: req.params.task_id};

        //Loading the changes from the form
        let taskUpdates = req.body;

        // update the task on the database
        await Task.updateOne(taskFilter, taskUpdates);

        // saved ok: go back to the task page
        let redirectLink = '/task/' + req.params.task_id;
        res.redirect(redirectLink);
    }
});

/* Remove task*/
router.get('/remove/:task_id', async (req, res) => {
    var filter = {_id: req.params.task_id};
    var task = await Task.find(filter);
    var proj = await Project.find({_id: task[0].project});
    await Task.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
    });
    res.redirect('/project/' + proj[0]._id);
});

/*POST newly added journal*/
router.post('/post/:task_id/journal', async (req, res) => {
    // create a new instance in memory from the message body
    let journal = Journal(req.body);
    journal.task = req.params.task_id;
    journal.author = req.session.userId;
    journal.date=new Date();
    // save a document to the database based on the instance content
    await journal.save();

    // saved ok: go back to the project page
    let redirectLink = '/task/' + req.params.task_id;
    res.redirect(redirectLink);
});


module.exports = router;
