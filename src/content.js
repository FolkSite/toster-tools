const fs = require( 'fs' );

const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

if ( !!commentForms ) {

    let script = document.createElement( 'script' );
    script.innerHTML = fs.readFileSync( __dirname + '/twpwyg.js', 'utf-8' );

    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

    const content = fs.readFileSync( __dirname + '/twpwyg.html', 'utf-8' );

    for ( let i = 0; i < commentForms.length; i++ ) {
        let form = commentForms[ i ];
        let field_wrap = form.querySelector( 'div.field_wrap' );

        let div = document.createElement( 'div' );
        div.innerHTML = content;
        field_wrap.insertBefore( div, field_wrap.firstChild );
    }
}