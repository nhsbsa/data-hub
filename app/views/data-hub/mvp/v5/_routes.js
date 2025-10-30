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

    if (forgottenPassword === 'yes') {
        res.redirect('/data-hub/mvp/v5/auth/entra-id/update-password');
    } else {
        res.redirect('/data-hub/mvp/v5/auth/my-account');
    }
});
router.post(/entra-create-account/, (req, res) => {
    const forgottenPassword = 'no'
    res.redirect('/data-hub/mvp/v5/auth/entra-id/create-password');
});
// ===================================
// Admin view
// ===================================
// POST route that converts Markdown and renders a new page
router.post(/add-new/, (req, res) => {
    const { action } = req.body; // "preview" or "draft"
    const markdown = req.session.data['newsBody'];
    const markdowntohtml = md.render(markdown);

    // req.session.data['markdowntohtml'] = markdowntohtml;

    // If user clicked "Preview article"
    if (action === 'preview') {
        return res.render('data-hub/mvp/v5/admin-view/news-preview', { markdowntohtml });
    }

    // If user clicked "Save as draft"
    if (action === 'draft') {
        // Redirect to drafts page or confirmation
        return res.render('data-hub/mvp/v5/admin-view/draft-news', { markdowntohtml });
    }

    // Default fallback
    res.redirect('/add-news');
});
router.post(/publish-news/, (req, res) => {
    req.session.data['newsPublished'] = "yes";
    res.redirect('published-article')
})

module.exports = router;
