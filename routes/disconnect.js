const express = require('express');

const router = express.Router();

/* GET disconnect*/
router.get('/', (req, res) => {
    //erasing the session variables
    req.session.destroy();
    //redirecting to the authentication page
    res.redirect('/auth')
});

module.exports = router;