const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const router = express.Router();


/* Create user*/
router.get('/user/new', async (req, res) => {
    res.render('userForm', {
        dbElement: 'user', element: null,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/* Udate user*/
router.get('/user/update/:user_id', async (req, res) => {

    //Fetching the instructions from the URL
    let userFilter;
    if (req.params.user_id) {
        userFilter = req.params.user_id
    }

    //Extracting the right user
    let user = await User.findOne({_id: userFilter});

    res.render('userForm', {
        dbElement: 'user', element: user,
        firstName: req.session.firstname, lastName: req.session.name
    });
});

/*POST user*/
router.post('/user/post/:par', async (req, res) => {

    if (req.params.par == 'new') {//No corresponding project has been found => Creating new project

        // create a new instance in memory from the message body
        let user = await new User(req.body);
        // save a document to the database based on the instance content
        await user.save();
        // saved ok: go back to the project page
        let redirectLink = '/settings';
        return res.redirect(redirectLink);
    } else { // Udpate project
        //Fetching the id of the project to update from the URL
        let userFilter = {_id: req.params.par};

        //Loading the changes from the form
        let userUpdates = req.body;

        // update the task on the database
        await User.updateOne(userFilter, userUpdates);

        // saved ok: go back to the task page
        let redirectLink = '/settings';
        return res.redirect(redirectLink);
    }
});

/* Remove user*/
router.get('/user/remove/:user_id', async (req, res) => {

    var filter = {_id: req.params.user_id};

    await User.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
    });

    return res.redirect('http://localhost:3000/settings');
});

module.exports = router;