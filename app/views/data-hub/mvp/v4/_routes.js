// External dependencies
const express = require('express');

const router = express.Router();

// Sign in
router.post(/sign-in/, (req, res) => {
    req.session.data['signedIn'] = 'yes'
    req.session.data['your-email']
    res.redirect('my-account'); 
});

// Sign out
router.post(/sign-out/, (req, res) => {
    req.session.data['signedIn'] = 'no'
    req.session.data['userType'] = ''
    res.redirect('/data-hub/mvp/v4/homepage');
});

router.post('/epact-user-journey', (req, res) => {    
    req.session.data['userType'] = 'epact'
    res.redirect('/data-hub/mvp/v4/homepage');
});






module.exports = router;
