// External dependencies
const express = require('express');

const router = express.Router();

router.post('/homepage-search', (req, res) => {
    res.redirect('search-results');
});

module.exports = router;
