const fs = require( 'fs' );

TWPWYG = require( './twpwyg' );

window.onload = function () {
    ( function () {

        const content = fs.readFileSync( __dirname + '/twpwyg.html', 'utf-8' );

        const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

        for ( let i = 0; i < commentForms.length; i++ ) {
            let form = commentForms[ i ];
            let div = document.createElement( 'div' );
            div.innerHTML = content;
            form.insertBefore( div, form.firstChild );
        }

    } )();
};