const express = require('express');
const Project = require('../models/projectModel');
const Status = require('../models/statusModel');
const User = require('../models/userModel');
const Priority = require('../models/priorityModel');

const router = express.Router();

/* GET disconnect*/
router.get('/settings', async (req, res) => {
    if(!req.session.userId)
        return res.redirect('/');
    //Extracting the selected task from the database
    let membersPopulateQuery = {path : 'members', select : 'name firstname -_id'};
    let projectData = await Project.find({members: req.session.userId})
        .populate(membersPopulateQuery);

    let statusData = await Status.find({});
    let mainUser = await User.find({_id: req.session.userId});
    let priorityData = await Priority.find();

    if (mainUser[0].roles[0] == 'admin') {
        let allUsers = await User.find();
        let projectData = await Project.find()
            .populate(membersPopulateQuery);
        return res.render('settings', {
            title: 'CRUD Settings  page',
            projects: projectData, statuses:statusData, priority: priorityData,
            users: allUsers, firstName: req.session.firstname, lastName: req.session.name
        });

    } else {
        return res.render('settings', {
            title: 'CRUD Settings page',
            projects: projectData, statuses:statusData, priority: priorityData,
            firstName: req.session.firstname, lastName: req.session.name
        });
    }
});

module.exports = router;