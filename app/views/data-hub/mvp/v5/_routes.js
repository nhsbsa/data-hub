// External dependencies
const express = require('express');
const router = express.Router();

// ===================================
// Sign in and out routes
// ===================================
router.post('/auth/entra-id/sign-in', (req, res) => {
    req.session.data['signedIn'] = 'yes'
    res.redirect('../my-account'); 
});
router.post(/sign-out/, (req, res) => {
    req.session.data['signedIn'] = 'no'
    req.session.data['userType'] = ''
    res.redirect('/data-hub/mvp/v5/homepage');
});
// ===================================
// Create an account routes
// ===================================
router.post(/full-name/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/job-role');
});
router.post(/job-role/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/associated-organisation');
});
router.post(/associated-organisation/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/your-email');
});
router.post(/your-email/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/check-your-answers');
});
router.post(/auth-code/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/create-password');
});
router.post(/create-password/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/my-account');
});
// ===================================
// Entra ID (replica)
// ===================================
router.post(/entra-id-sign-in/, (req, res) => {
    res.redirect('/data-hub/mvp/v5/auth/entra-id/enter-password');
});
router.post(/entra-password/, (req, res) => {
    const forgottenPassword = 'no'
    res.redirect('/data-hub/mvp/v5/auth/entra-id/enter-code');
});
router.post(/enter-code/, (req, res) => {
    const forgottenPassword = req.session.data['forgottenPassword']
    req.session.data['signedIn'] = 'yes'

    if (forgottenPassword === 'yes'){
        res.redirect('/data-hub/mvp/v5/auth/entra-id/update-password');
    } else {
        res.redirect('/data-hub/mvp/v5/auth/my-account');
    } 
});
router.post(/entra-create-account/, (req, res) => {
    const forgottenPassword = 'no'
    res.redirect('/data-hub/mvp/v5/auth/entra-id/create-password');
});

module.exports = router;
