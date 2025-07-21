// External dependencies
const express = require('express');
const router = express.Router();

// ===================================
// Sign in and out routes
// ===================================
router.post('/auth/sign-in', (req, res) => {
    req.session.data['signedIn'] = 'yes'
    res.redirect('my-account'); 
});
router.post(/sign-out/, (req, res) => {
    req.session.data['signedIn'] = 'no'
    req.session.data['userType'] = ''
    res.redirect('/data-hub/mvp/v4/homepage');
});
// ===================================



module.exports = router;
