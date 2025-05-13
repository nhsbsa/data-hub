// External dependencies
const express = require('express');

const router = express.Router();

router.use('/data-hub/v1-1', require('./views/data-hub/v1-1/_routes'));

module.exports = router;
