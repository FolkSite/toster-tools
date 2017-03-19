const fs = require( 'fs' );

const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

if ( !!commentForms ) {

    let script = document.createElement( 'script' );
    script.innerHTML = fs.readFileSync( __dirname + '/twpwyg.js', 'utf-8' );

    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

    const content = fs.readFileSync( __dirname + '/toolbar.html', 'utf-8' );

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


var Timer = null;

var Options = {
    ajax: false,
    interval: 10,
    feed_url: "https://toster.ru/my/feed",
    tracker_url: "https://toster.ru/my/tracker"
};

const onMessageHandler = ( request, sender, callback ) => {
    if ( !!request && !!request.cmd && ( request.cmd === 'options' ) ) {
        Options = Object.assign( {}, Options, request.data );
        reStartTimer();
    }
};

const getNotifyPage = () => {
    return fetch( Options.tracker_url, {
            credentials: 'include'
        } )
        .then( function ( response ) {
            return ( response.ok === true ) ? response.text() : false;
        } )
        .catch( console.log );
};

const startTimer = () => {
    if ( !Options.ajax ) {
        return false;
    }

    if ( !!Timer ) {
        return false;
    }

    Timer = setInterval( function () {
        getNotifyPage().then( function ( _body ) {
            let $aside = document.querySelector( 'aside.layout__navbar[role="navbar"]' );
            let body = document.createElement( "div" );
            body.innerHTML = _body;
            let $event_list = body.querySelector( 'ul.events-list' );

            try {
                $aside.removeChild( $aside.querySelector( 'ul.events-list' ) );
            } catch ( e ) {}

            $aside.appendChild( $event_list );
        } );
    }, Options.interval * 1000 );
};

const stopTimer = () => {
    clearInterval( Timer );
    Timer = null;
};

const reStartTimer = () => {
    stopTimer();
    startTimer();
};


chrome.extension.onMessage.addListener( onMessageHandler );

chrome.extension.sendMessage( {
    cmd: 'options'
}, {}, onMessageHandler );