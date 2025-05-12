// External dependencies
const express = require('express');

const router = express.Router();

router.post(/search-data-hub/, (req, res) => {
    res.redirect('search-results');
});

module.exports = router;
