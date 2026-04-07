// External dependencies
const express = require('express');

const router = express.Router();

//
// DETECT CURRENT VERSION
//
router.use((req, res, next) => {

  console.log('-----------------------------------');
  console.log(req.method + ': ' + req.originalUrl);

  // Versions
  const versions = ['dc146','v2','v3','v4-1','v4-2','v4-3','v5'];

  // Clear current routes 
  router.stack = router.stack.filter(layer => layer.name !== 'router');

  // Get the current version needed
  let version = '';
  versions.forEach(function (vers) {
    if (req.originalUrl.toLowerCase().indexOf('/' + vers + '/') > -1) {
      version = vers;
    }
  });

  res.locals.version = version;
  res.locals.currentURL = req.originalUrl;
  
  // Load the required routes
  if (version) {
    console.log('Loading routes for ' + version);
    router.use('/data-hub/mvp/' + version, require('./views/data-hub/mvp/' + version + '/_routes'));
  }
  
  next();

});

// Assumptions Folder
// router.use('/data-hub/assumptions/v1-2', require('./views/data-hub/assumptions/v1-2/_routes'));
// router.use('/data-hub/assumptions/v1-1', require('./views/data-hub/assumptions/v1-1/_routes'));

module.exports = router;
