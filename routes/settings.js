const express = require('express');

const Project = require('../models/projectModel')
const Task = require('../models/taskModel');
const Journal = require('../models/journalModel');
const Status = require('../models/statusModel');
const User = require('../models/userModel');

const router = express.Router();

/* GET disconnect*/
router.get('/settings', async (req, res) => {
    console.log('Entrou!');
    let projectData = await Project.find({members: req.session.userId});

    // TO DO: Populate members

    //console.log(projectData);
    let statusData = await Status.find({});
    //console.log(statusData);
    let mainUser = await User.find({_id: req.session.userId});

    if (mainUser[0].roles[0] == 'admin') { //maybe sort the vector
        let allUsers = await User.find();
        console.log('admin');
        //, mainuser: mainUser, allUsers
        return res.render('settings', {title: 'CRUD Settings  page',
            projects: projectData, statuses:statusData, users: allUsers,
            firstName: req.session.firstname, lastName: req.session.name
        });

    } else {
        return res.render('settings', {
            title: 'CRUD Settings page',
            firstName: req.session.firstname, lastName: req.session.name
        });
        /*res.render('settings', {
            project: projectData, user: mainUser, status:statusData,
            firstName: req.session.firstname, lastName: req.session.name
        });*/

    }
});

module.exports = router;