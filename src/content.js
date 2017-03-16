window.onload = function () {
    ( function () {

        window.TWPWYG = require( './twpwyg' );

        const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

        for ( let i = 0; i < commentForms.length; i++ ) {
            let form = commentForms[ i ];
            let div = document.createElement( 'div' );
            div.innerHTML = TWPWYG.getPanel();
            form.insertBefore( div, form.firstChild );
        }

    } )();
};