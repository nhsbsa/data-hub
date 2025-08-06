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
    res.redirect('/data-hub/mvp/v4-1/homepage');
});
// ===================================
// Create an account routes
// ===================================
router.post(/full-name/, (req, res) => {
    res.redirect('/data-hub/mvp/v4-1/auth/job-role');
});
router.post(/job-role/, (req, res) => {
    res.redirect('/data-hub/mvp/v4-1/auth/associated-organisation');
});
router.post(/associated-organisation/, (req, res) => {
    res.redirect('/data-hub/mvp/v4-1/auth/your-email');
});
router.post(/your-email/, (req, res) => {
    res.redirect('/data-hub/mvp/v4-1/auth/check-your-answers');
});
router.post(/auth-code/, (req, res) => {
    res.redirect('/data-hub/mvp/v4-1/auth/create-password');
});
router.post(/create-password/, (req, res) => {
    res.redirect('/data-hub/mvp/v4-1/auth/my-account');
});

module.exports = router;
