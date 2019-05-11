const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Status = require('../models/statusModel');

const router = express.Router();


/* Create status*/
router.get('/status/new', async (req, res) => {
    res.render('statusForm', {
        dbElement: 'status', element: null,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/* Udate status*/
router.get('/status/update/:status_id', async (req, res) => {

    //Fetching the instructions from the URL
    let statusFilter;
    if (req.params.status_id) {
        statusFilter = req.params.status_id
    }

    //Extracting the right status
    let status = await Status.findOne({_id: statusFilter})

    res.render('statusForm', {
        dbElement: 'status', element: status,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*POST status*/
router.post('/status/post/:par', async (req, res) => {

    if (req.params.par == 'new') {//No corresponding project has been found => Creating new project

        // create a new instance in memory from the message body
        let status = await new Status(req.body);
        // save a document to the database based on the instance content
        await status.save();
        // saved ok: go back to the project page
        let redirectLink = '/settings';
        return res.redirect(redirectLink);
    } else { // Udpate project
        //Fetching the id of the project to update from the URL
        let statusFilter = {_id: req.params.par};

        //Loading the changes from the form
        let statusUpdates = req.body;

        // update the task on the database
        await Status.updateOne(statusFilter, statusUpdates);

        // saved ok: go back to the task page
        let redirectLink = '/settings';
        return res.redirect(redirectLink);
    }
});

/* Remove status*/
router.get('/status/remove/:status_id', async (req, res) => {

    var filter = {_id: req.params.status_id};

    await Status.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
    });

    res.redirect('http://localhost:3000/settings');
});

module.exports = router;