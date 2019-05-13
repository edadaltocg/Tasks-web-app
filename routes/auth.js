const express = require('express');
const User = require('../models/userModel');

const router = express.Router();


/* GET authentication page */
router.get('/', (req, res) => {
    res.render('auth');
});

/* GET authentication error page */
router.get('/error', (req, res) => {
    res.render('authErr');
});


/* POST user logging in form*/
router.post('/form', async(req, res) => {
    //Load the users information on the memory
    let userConnecting = User(req.body);

    //Extracting the corresponding user from the database
        //If the information are incorrect, userData = null
    let userData = await User.findOne({login: userConnecting.login, password: userConnecting.password})
        .catch((mongoError) => res.render('error', {error: mongoError}));

    if (userData != null) {//Success
        //Creating the session variables linked to the user that has logged in
        req.session.userId = userData.id;
        req.session.name = userData.name;
        req.session.firstname = userData.firstname;

        res.redirect('/projects'); //Redirecting to the project page
    } else {//Error
        res.redirect('/auth/error'); //Redirecting to the authentication error page
    }
});

module.exports = router;