const fs = require( 'fs' );

const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

if ( !!commentForms ) {

    let script = document.createElement( 'script' );
    script.innerHTML = fs.readFileSync( __dirname + '/twpwyg.js', 'utf-8' );

    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

    const content = fs.readFileSync( __dirname + '/twpwyg.html', 'utf-8' );

    const createElement = ( str ) => {
        let elem = document.createElement( 'div' );
        elem.innerHTML = str;
        if ( elem.childNodes.length > 0 ) {
            return elem.childNodes[ 0 ];
        }
        return elem;
    }


    for ( let i = 0; i < commentForms.length; i++ ) {
        let form = commentForms[ i ];
        let field_wrap = form.querySelector( 'div.field_wrap' );

        let div = document.createElement( 'div' );
        div.appendChild( createElement( content ) );
        field_wrap.insertBefore( div, field_wrap.firstChild );
    }
}