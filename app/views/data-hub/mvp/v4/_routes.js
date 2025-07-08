// External dependencies
const express = require('express');

const router = express.Router();

router.get('/product-sign-in', (req, res) => {
    const userType = req.query.userType;
    
    res.render('data-hub/mvp/v4/product-sign-in', { userType });
});

router.post('/individual-product-sign-in/', (req, res) => {
    const userType = req.session.data.userType;

    if (userType === 'epact') {
        req.session.data['productSignedInAs'] = 'epact'
        res.redirect('data-products/epact/epact-loggedin');
    } else if  (userType === 'eden') {
        req.session.data['productSignedInAs'] = 'eden'
        res.redirect('data-products/eden/eden-loggedin');
    } else if  (userType === 'eops') {
        req.session.data['productSignedInAs'] = 'eops'
        res.redirect('data-products/eops/eops-loggedin');
    } else {
        res.redirect('product-sign-in');
    }
    
});

// Create an account

// Enter your full name
router.post(/full-name/, (req, res) => {
    const fullName = req.session.data['full-name'];
    res.redirect('job-role');
});

// What is your job role
router.post(/job-role/, (req, res) => {
    const jobRole = req.session.data['job-role'];
    res.redirect('associated-organisation');
});

// Which organisation are you associated with
router.post(/associated-organisation/, (req, res) => {
    const associatedOrganisation = req.session.data['associated-organisation'];
    res.redirect('your-email');
});

// Which organisation are you associated with
router.post(/your-email/, (req, res) => {
    const associatedOrganisation = req.session.data['associated-organisation'];
    res.redirect('check-your-answers');
});

// Enter authentication code
router.post(/auth-code/, (req, res) => {
    const authCode = req.session.data['auth-code'];
    res.redirect('create-password');
});

// Create a password
router.post(/create-password/, (req, res) => {
    const passwordInput = req.session.data['password-input'];

    req.session.data['signedIn'] = 'yes'

    res.redirect('my-account');
});

// Sign in
router.post(/sign-in/, (req, res) => {
    req.session.data['signedIn'] = 'yes'
    req.session.data['your-email'] = ''
    const userType = req.session.data['userType'];

    if (userType == 'epact') {
        res.redirect('/data-hub/mvp/v4/data-products/epact/epact-loggedin')
    } else {
        res.redirect('my-account'); 
    }    
});

// Sign out
router.post(/sign-out/, (req, res) => {
    req.session.data['signedIn'] = 'no'
    req.session.data['userType'] = ''

    res.redirect('/data-hub/mvp/v4/homepage');
});


module.exports = router;
