// External dependencies
const express = require('express');
const router = express.Router();
// Mardown converter
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});
// end markdown converter

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
    res.redirect('/data-hub/mvp/dc146/homepage');
});
// ===================================
// Create an account routes
// ===================================
router.post(/full-name/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/job-role');
});
router.post(/job-role/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/associated-organisation');
});
router.post(/associated-organisation/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/your-email');
});
router.post(/your-email/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/check-your-answers');
});
router.post(/auth-code/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/create-password');
});
router.post(/create-password/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/my-account');
});
// ===================================
// Entra ID (replica)
// ===================================
router.post(/entra-id-sign-in/, (req, res) => {
    res.redirect('/data-hub/mvp/dc146/auth/entra-id/enter-password');
});
router.post(/entra-password/, (req, res) => {
    const forgottenPassword = 'no'
    res.redirect('/data-hub/mvp/dc146/auth/entra-id/enter-code');
});
router.post(/enter-code/, (req, res) => {
    const forgottenPassword = req.session.data['forgottenPassword']
    req.session.data['signedIn'] = 'yes'

    if (forgottenPassword === 'yes') {
        res.redirect('/data-hub/mvp/dc146/auth/entra-id/update-password');
    } else {
        res.redirect('/data-hub/mvp/dc146/auth/my-account');
    }
});
router.post(/entra-create-account/, (req, res) => {
    const forgottenPassword = 'no'
    res.redirect('/data-hub/mvp/dc146/auth/entra-id/create-password');
});
// ===================================
// Admin view
// ===================================
// NEWS POST route that converts Markdown and renders a new page
router.post(/add-new/, (req, res) => {
    const { action } = req.body; // "preview" or "draft"
    const markdown = req.session.data['newsBody'];
    const markdowntohtml = md.render(markdown);

    // req.session.data['markdowntohtml'] = markdowntohtml;

    // If user clicked "Preview article"
    if (action === 'preview') {
        return res.render('data-hub/mvp/dc146/admin-view/news-preview', { markdowntohtml });
    }

    // If user clicked "Save as draft"
    if (action === 'draft') {
        // Redirect to drafts page or confirmation
        return res.render('data-hub/mvp/dc146/admin-view/draft-news', { markdowntohtml });
    }

    // Default fallback
    res.redirect('/add-news');
});
router.post(/publish-news/, (req, res) => {
    req.session.data['newsPublished'] = "yes";
    res.redirect('published-article')
})

// TRAINING POST route that converts Markdown and renders a new page
router.post(/add-training/, (req, res) => {
    const { action } = req.body; // "preview" or "draft"
    const markdown = req.session.data['trainingBody'];
    const trainingMarkdown = md.render(markdown);

    // req.session.data['trainingMarkdown'] = trainingMarkdown;

    // If user clicked "Preview article"
    if (action === 'preview') {
        return res.render('data-hub/mvp/dc146/training-hub/admin-view/training-preview', { trainingMarkdown });
    }

    // If user clicked "Save as draft"
    if (action === 'draft') {
        // Redirect to drafts page or confirmation
        return res.render('data-hub/mvp/dc146/training-hub/admin-view/draft-training', { trainingMarkdown });
    }

    // Default fallback
    res.redirect('/add-training');
});
router.post(/publish-training/, (req, res) => {
    req.session.data['trainingPublished'] = "yes";
    res.redirect('published-training')
})

// Would you like to add any related resources?
router.post(/related-resources-required/, (req, res) => {    
    res.redirect('add-related-resources');
})

router.post(/add-related-resources/, (req, res) => {    

    const addRelatedResources = req.session.data['add-related-resources'];

    if (addRelatedResources === 'yes'){
        res.redirect('search-related-resources');
    } else {
        res.redirect('dashboard-preview');
    }
})

module.exports = router;
