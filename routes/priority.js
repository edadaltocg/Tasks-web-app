const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Priority = require('../models/priorityModel');

const router = express.Router();


/* Create priority*/
router.get('/priority/new', async (req, res) => {
    res.render('priorityForm', {
        dbElement: 'priority', element: null,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/* Update priority*/
router.get('/priority/update/:priority_id', async (req, res) => {

    //Fetching the instructions from the URL
    let priorityFilter;
    if (req.params.priority_id) {
        priorityFilter = req.params.priority_id
    }

    //Extracting the right priority
    let priority = await Priority.findOne({_id: priorityFilter})

    res.render('priorityForm', {
        dbElement: 'priority', element: priority,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*POST priority*/
router.post('/priority/post/:par', async (req, res) => {

    if (req.params.par == 'new') {//No corresponding project has been found => Creating new project
        // create a new instance in memory from the message body
        let priority = await new Priority(req.body);
        // save a document to the database based on the instance content
        await priority.save();
        // saved ok: go back to the project page
        let redirectLink = '/settings';
        return res.redirect(redirectLink);
    } else { // Udpate project
        //Fetching the id of the project to update from the URL
        let priorityFilter = {_id: req.params.par};

        //Loading the changes from the form
        let priorityUpdates = req.body;

        // update the task on the database
        await Priority.updateOne(priorityFilter, priorityUpdates);

        // saved ok: go back to the task page
        let redirectLink = '/settings';
        return res.redirect(redirectLink);
    }
});

/* Remove priority*/
router.get('/priority/remove/:priority_id', async (req, res) => {

    var filter = {_id: req.params.priority_id};

    await Priority.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
    });

    res.redirect('http://localhost:3000/settings');
});

module.exports = router;