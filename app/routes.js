// External dependencies
const express = require('express');

const router = express.Router();

// Ad-hoc version for developers (new contract of work)
router.use('/data-hub/mvp/dc146', require('./views/data-hub/mvp/dc146/_routes'));

// MVP Folder
router.use('/data-hub/mvp/v5', require('./views/data-hub/mvp/v5/_routes'));
router.use('/data-hub/mvp/v4-3', require('./views/data-hub/mvp/v4-3/_routes'));
router.use('/data-hub/mvp/v4-2', require('./views/data-hub/mvp/v4-2/_routes'));
router.use('/data-hub/mvp/v4-1', require('./views/data-hub/mvp/v4-1/_routes'));
router.use('/data-hub/mvp/v4', require('./views/data-hub/mvp/v4/_routes'));
router.use('/data-hub/mvp/v3', require('./views/data-hub/mvp/v3/_routes'));
router.use('/data-hub/mvp/v2', require('./views/data-hub/mvp/v2/_routes'));

// Assumptions Folder
// router.use('/data-hub/assumptions/v1-2', require('./views/data-hub/assumptions/v1-2/_routes'));
// router.use('/data-hub/assumptions/v1-1', require('./views/data-hub/assumptions/v1-1/_routes'));

module.exports = router;
