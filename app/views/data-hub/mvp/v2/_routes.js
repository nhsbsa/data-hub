// External dependencies
const express = require('express');

const router = express.Router();

router.get('/product-sign-in', (req, res) => {
    const userType = req.query.userType;
    res.render('data-hub/mvp/v2/product-sign-in', { userType });
});

module.exports = router;
