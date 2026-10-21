// External dependencies
const express = require('express');
const router = express.Router();

//
// EDIT METADATA PAGE
//
router.get( /edit-metadata-page/, ( req, res ) => {

    // Make sure we're signed in
    if( req.session.data.signedIn !== 'yes' ){
        req.session.data.signedIn = 'yes';
    }

    res.render( req.originalUrl.split('?')[0].replace(/^\//, '') + '.html', {
        data: req.session.data
    });

});

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

    console.log( 'HELLO' );

    if( req.session.data.removeTerms && req.session.data.searchTerms ){

        if( req.session.data.removeTerms === 'allTerms' ){
            delete req.session.data.searchTerms;
        } else {
            req.session.data.searchTerms.splice( req.session.data.searchTerms.indexOf( req.session.data.removeTerms ), 1);
        }

        delete req.session.data.removeTerms;

        res.redirect('browse');

    } else {

        res.render( req.originalUrl.split('?')[0].replace(/^\//, ''));

    }

});


//
// ENTRA SCREENS
//
router.post(/enter-username/, (req, res) => {
    res.redirect('enter-password');
});

router.post(/enter-password/, (req, res) => {
    res.redirect('enter-code');
});

router.post(/enter-code/, (req, res) => {
    req.session.data.signedIn = 'yes';
    res.redirect( req.session.data.returnURL || '../../' );
});



module.exports = router;