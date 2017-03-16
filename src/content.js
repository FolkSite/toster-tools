const fs = require( 'fs' );

window.TWPWYG = require( './twpwyg' ).TWPWYG;

window.onload = function () {
    ( function () {

        const content = fs.readFileSync( __dirname + '/twpwyg.html', 'utf-8' );

        const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

        for ( let i = 0; i < commentForms.length; i++ ) {
            let form = commentForms[ i ];
            let field_wrap = form.querySelector( 'div.field_wrap' );

            let div = document.createElement( 'div' );
            div.innerHTML = content;
            field_wrap.insertBefore( div, field_wrap.firstChild );
        }

    } )();
};