const utils = require( '../js/utils' );

var browser = browser || chrome;

const {
    $,
    $$,
    createElement
} = utils;

class Extension {
    constructor( ...args ) {
        this.Timer = null;
        this.Options = {
            ajax: false,
            interval: 10,
            show_toolbar: true,
            use_kbd: true,
            use_notifications: false,
            feed_url: "https://toster.ru/my/feed",
            tracker_url: "https://toster.ru/my/tracker"
        };
    }

    addKeyDownListener() {
        let textareas = $$( 'textarea.textarea' );
        for ( let i = 0; i < textareas.length; i++ ) {
            let textarea = textareas[ i ];
            textarea.addEventListener( 'keydown', event => {
                let form = $( 'form', textarea );
                let button = $( 'button[type="submit"]', form );
                if ( ( event.ctrlKey || event.metaKey ) && ( event.keyCode == 13 || event.keyCode == 10 ) ) {
                    if ( !!this.Options.use_kbd ) {
                        button.click();
                    }
                }
            } );
        }
    }

    getNotifyPage() {
        return fetch( this.Options.tracker_url, {
                credentials: 'include'
            } )
            .then( response => !!response.ok ? response.text() : false )
            .catch( console.log );
    }

    stopTimer() {
        clearInterval( this.Timer );
        this.Timer = null;
    }

    reStartTimer() {
        this.stopTimer();
        this.startTimer();
    }

    startTimer() {
        if ( !!this.Timer || !this.Options.ajax || ( this.Options.interval === 0 ) ) {
            return false;
        }

        this.Timer = setInterval( () => {
            this.getNotifyPage().then( _body => {
                let $aside = $( 'aside.layout__navbar[role="navbar"]' );
                let body = document.createElement( "div" );
                body.innerHTML = _body;
                let $event_list = body.querySelector( 'ul.events-list' );
                let $old_event_list = $aside.querySelector( 'ul.events-list' );
                let count = 0;

                try {
                    $aside.removeChild( $old_event_list );
                } catch ( e ) {}

                if ( !!$event_list && !!this.Options.use_notifications ) {
                    let events_items = $$( 'li', $event_list );

                    if ( events_items.length > 3 ) {
                        let text = $event_list.lastElementChild.textContent;
                        count = parseInt( text );
                    } else {
                        count = events_items.length;
                    }

                    if ( count > 0 ) {
                        this.sendMessage( {
                            cmd: 'notify',
                            count: count
                        } );
                    }
                }

                $aside.appendChild( $event_list );
            } );
        }, this.Options.interval * 1000 );
    }

    showToolbar() {
        let toolbars = $$( 'div.twpwyg_toolbar' );

        if ( !!toolbars && toolbars.length ) {
            if ( !!this.Options.show_toolbar ) {
                for ( let i = 0; i < toolbars.length; i++ ) {
                    toolbars[ i ].classList.remove( 'hidden' );
                }
            } else {
                for ( let i = 0; i < toolbars.length; i++ ) {
                    toolbars[ i ].classList.add( 'hidden' );
                }
            }
        } else {
            if ( !this.Options.show_toolbar ) {
                return;
            }

            const commentForms = $$( 'form.form_comments[role$="comment_form"]' );

            if ( !!commentForms ) {

                let script = document.createElement( 'script' );
                script.src = browser.extension.getURL( 'resources/twpwyg.js' );

                $( 'head' ).appendChild( script );

                const toolbar_url = browser.extension.getURL( 'resources/toolbar.html' );

                fetch( toolbar_url, {
                        credentials: 'include'
                    } )
                    .then( response => response.text() )
                    .then( body => {
                        for ( let i = 0; i < commentForms.length; i++ ) {
                            let form = commentForms[ i ];
                            let field_wrap = form.querySelector( 'div.field_wrap' );

                            let div = document.createElement( 'div' );
                            div.appendChild( createElement( body ) );
                            field_wrap.insertBefore( div, field_wrap.firstChild );
                        }
                    } )
                    .catch( console.log );

            }
        }
    }

    sendMessageToBackgroundScript( request ) {
        browser.runtime.sendMessage( request, {}, callbackMessage );
    }
}

var Ext = new Extension();

function callbackMessage( request, sender, callback ) {
    if ( !!request && !!request.cmd ) {
        Ext.Options = Object.assign( {}, Ext.Options, request.data || {} );
        Ext.reStartTimer();
        Ext.showToolbar();
        Ext.addKeyDownListener();
    }
}

browser.runtime.onMessage.addListener( ( request, sender, callback ) => {
    callbackMessage( request, sender, callback );
} );

Ext.sendMessageToBackgroundScript( {
    cmd: 'options'
} );