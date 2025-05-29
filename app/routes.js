// External dependencies
const express = require('express');

const router = express.Router();

// MVP Folder
router.use('/data-hub/mvp/v2', require('./views/data-hub/mvp/v2/_routes'));

// Assumptions Folder
router.use('/data-hub/assumptions/v1-2', require('./views/data-hub/assumptions/v1-2/_routes'));
router.use('/data-hub/assumptions/v1-1', require('./views/data-hub/assumptions/v1-1/_routes'));

module.exports = router;
