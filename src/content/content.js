const fs = require( 'fs' );

var Timer = null;

var Options = {
    ajax: false,
    interval: 10,
    show_toolbar: true,
    use_kbd: true,
    use_notifications: false,
    feed_url: "https://toster.ru/my/feed",
    tracker_url: "https://toster.ru/my/tracker"
};

function $( selector, parent ) {
    return ( parent || document ).querySelector( selector );
}

function $$( selector, parent ) {
    return ( parent || document ).querySelectorAll( selector );
}

const addKeyDownListener = () => {
    let textareas = $$( 'textarea.textarea' );
    for ( let i = 0; i < textareas.length; i++ ) {
        let textarea = textareas[ i ];
        textarea.addEventListener( 'keydown', function ( e ) {
            let form = $( 'form', textarea );
            let button = $( 'button[type="submit"]', form );
            if ( ( e.ctrlKey || e.metaKey ) && ( e.keyCode == 13 || e.keyCode == 10 ) ) {
                if ( !!Options.use_kbd ) {
                    button.click();
                }
            }
        } );
    }
};

const showToolbar = () => {

    let toolbars = $$( 'div.twpwyg_toolbar' );

    if ( !!toolbars && toolbars.length ) {
        if ( !!Options.show_toolbar ) {
            for ( let i = 0; i < toolbars.length; i++ ) {
                toolbars[ i ].classList.remove( 'hidden' );
            }
        } else {
            for ( let i = 0; i < toolbars.length; i++ ) {
                toolbars[ i ].classList.add( 'hidden' );
            }
        }
    } else {
        if ( !Options.show_toolbar ) {
            return;
        }

        const commentForms = $$( 'form.form_comments[role$="comment_form"]' );

        if ( !!commentForms ) {

            let script = document.createElement( 'script' );
            script.innerHTML = fs.readFileSync( __dirname + '/twpwyg.js', 'utf-8' );

            document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

            const toolbar_html = fs.readFileSync( __dirname + '/toolbar.html', 'utf-8' );

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
                div.appendChild( createElement( toolbar_html ) );
                field_wrap.insertBefore( div, field_wrap.firstChild );
            }
        }
    }
};


const onMessageHandler = ( request, sender, callback ) => {
    if ( !!request && !!request.cmd ) {
        Options = Object.assign( {}, Options, request.data || {} );
        reStartTimer();
        showToolbar();
        addKeyDownListener();
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
    if ( !!Timer || !Options.ajax || ( Options.interval === 0 ) ) {
        return false;
    }

    Timer = setInterval( function () {
        getNotifyPage().then( function ( _body ) {
            let $aside = $( 'aside.layout__navbar[role="navbar"]' );
            let body = document.createElement( "div" );
            body.innerHTML = _body;
            let $event_list = body.querySelector( 'ul.events-list' );
            let $old_event_list = $aside.querySelector( 'ul.events-list' );
            let count = 0;

            try {
                $aside.removeChild( $old_event_list );
            } catch ( e ) {}

            if ( !!Options.use_notifications ) {
                let events_items = $event_list.querySelectorAll( 'li' );

                if ( events_items.length > 3 ) {
                    let text = events_items[ events_items.length - 1 ].querySelector( 'a' ).querySelector( 'span' ).innerText;
                    count = parseInt( text );
                } else {
                    count = events_items.length;
                }

                if ( count > 0 ) {
                    sendMessage( {
                        cmd: 'notify',
                        count: count
                    } );
                }
            }

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

const sendMessage = ( request ) => {
    chrome.extension.sendMessage( request, {}, onMessageHandler );
};


chrome.extension.onMessage.addListener( onMessageHandler );

sendMessage( {
    cmd: 'options'
} );