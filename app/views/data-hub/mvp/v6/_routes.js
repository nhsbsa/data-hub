// External dependencies
const express = require('express');
const router = express.Router();

//
// BROWSE (POST)
//
router.post( /browse/, (req, res) => {

    if( !Array.isArray(req.session.data.searchTerms) ){
        req.session.data.searchTerms = [];
    }

    if( req.session.data.searchTerm ){

        const searchTerm = req.session.data.searchTerm.split(',');
        searchTerm.forEach(function( st ){

            st = st.trim();

            if( st && req.session.data.searchTerms.indexOf( st ) === -1 ){
                req.session.data.searchTerms.push( st );
            }

        });
        
    }
  
    delete req.session.data.searchTerm;

    res.redirect('browse');

});

//
// BROWSE (GET)
//
router.get( /browse/, (req, res) => {

    if( req.session.data.removeTerms && req.session.data.searchTerms ){

        if( req.session.data.removeTerms === 'allTerms' ){
            delete req.session.data.searchTerms;
        } else {
            req.session.data.searchTerms.splice( req.session.data.searchTerms.indexOf( req.session.data.removeTerms ), 1);
        }

        delete req.session.data.removeTerms;

        res.redirect('browse');

    } else {

        res.render('app/views/data-hub/mvp/v6/browse');

    }

});


//
//.ENTRA SCREENS
//
router.post(/enter-username/, (req, res) => {
    res.redirect('enter-password');
});

router.post(/enter-password/, (req, res) => {
    res.redirect('enter-code');
});

router.post(/enter-code/, (req, res) => {

    console.log( req.session.data.returnURL );

    req.session.data['signedIn'] = 'yes';
    res.redirect( req.session.data.returnURL || '../../' );

    /*
    const forgottenPassword = req.session.data['forgottenPassword'];
    req.session.data['signedIn'] = 'yes';

    if (forgottenPassword === 'yes') {
        res.redirect('update-password');
    } else {
        
    }
    */

});



module.exports = router;